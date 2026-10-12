package com.commerce.shopnova.order.service;

import com.commerce.shopnova.auth.model.User;
import com.commerce.shopnova.cart.model.CartItem;
import com.commerce.shopnova.cart.repository.CartItemRepository;
import com.commerce.shopnova.cart.service.CartService;
import com.commerce.shopnova.catalog.exception.InsufficientStockException;
import com.commerce.shopnova.catalog.exception.ResourceNotFoundException;
import com.commerce.shopnova.catalog.model.Product;
import com.commerce.shopnova.catalog.repository.ProductRepository;
import com.commerce.shopnova.order.dto.CheckoutRequest;
import com.commerce.shopnova.order.dto.OrderDto;
import com.commerce.shopnova.order.dto.OrderItemDto;
import com.commerce.shopnova.order.model.Order;
import com.commerce.shopnova.order.model.OrderItem;
import com.commerce.shopnova.order.model.OrderStatus;
import com.commerce.shopnova.order.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        CartItemRepository cartItemRepository,
                        CartService cartService,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartService = cartService;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderDto checkout(User user, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtDesc(user);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot place order: your shopping cart is empty");
        }

        // 1. Verify and atomically deduct inventory
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            int updatedRows = productRepository.deductStock(product.getId(), item.getQuantity());
            if (updatedRows == 0) {
                Product fresh = productRepository.findById(product.getId()).orElse(product);
                throw new InsufficientStockException(
                        "Stock depleted for '" + fresh.getName() + "'. Available: " + fresh.getStockQuantity() + ", requested: " + item.getQuantity()
                );
            }
        }

        // 2. Compute financial totals
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            BigDecimal effectivePrice = p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getPrice();
            subtotal = subtotal.add(effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        BigDecimal shipping = subtotal.compareTo(new BigDecimal("50.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("9.99");
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(shipping).add(tax).setScale(2, RoundingMode.HALF_UP);

        // 3. Assemble and persist Order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setRecipientName(request.recipientName());
        order.setRecipientPhone(request.recipientPhone());
        order.setShippingAddress(request.shippingAddress());
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setPaymentStatus("COMPLETED");
        order.setStatus(OrderStatus.CONFIRMED);
        order.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        order.setShippingCost(shipping);
        order.setTaxAmount(tax);
        order.setTotalAmount(total);

        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            BigDecimal effectivePrice = p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getPrice();
            BigDecimal itemSubtotal = effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            OrderItem orderItem = new OrderItem(
                    order,
                    p,
                    p.getName(),
                    p.getSku(),
                    p.getImageUrl(),
                    effectivePrice,
                    item.getQuantity(),
                    itemSubtotal
            );
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // 4. Clear shopping cart
        cartService.clearCart(user);

        return toDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new ResourceNotFoundException("Order does not belong to user");
        }

        return toDto(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toDto);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return toDto(updated);
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new ResourceNotFoundException("Order does not belong to user");
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Delivered orders cannot be cancelled");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            return toDto(order);
        }

        // Return stock
        for (OrderItem item : order.getItems()) {
            productRepository.replenishStock(item.getProduct().getId(), item.getQuantity());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order cancelled = orderRepository.save(order);
        return toDto(cancelled);
    }

    public OrderDto toDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> new OrderItemDto(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProductName(),
                        item.getProductSku(),
                        item.getProductImageUrl(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new OrderDto(
                order.getId(),
                order.getOrderNumber(),
                order.getUser().getEmail(),
                order.getRecipientName(),
                order.getRecipientPhone(),
                order.getShippingAddress(),
                order.getPaymentMethod(),
                order.getPaymentTransactionId(),
                order.getPaymentStatus(),
                order.getStatus(),
                order.getSubtotal(),
                order.getShippingCost(),
                order.getTaxAmount(),
                order.getTotalAmount(),
                itemDtos,
                order.getCreatedAt()
        );
    }

    private String generateOrderNumber() {
        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "ORD-" + dateStr + "-" + randomSuffix;
    }
}
