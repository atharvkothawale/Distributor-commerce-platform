package com.commerce.shopnova.cart.service;

import com.commerce.shopnova.auth.model.User;
import com.commerce.shopnova.cart.dto.AddToCartRequest;
import com.commerce.shopnova.cart.dto.CartItemDto;
import com.commerce.shopnova.cart.dto.CartSummaryDto;
import com.commerce.shopnova.cart.dto.UpdateCartItemRequest;
import com.commerce.shopnova.cart.model.CartItem;
import com.commerce.shopnova.cart.repository.CartItemRepository;
import com.commerce.shopnova.catalog.exception.InsufficientStockException;
import com.commerce.shopnova.catalog.exception.ResourceNotFoundException;
import com.commerce.shopnova.catalog.model.Product;
import com.commerce.shopnova.catalog.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public CartService(CartItemRepository cartItemRepository, ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public CartSummaryDto getCartForUser(User user) {
        List<CartItem> items = cartItemRepository.findByUserOrderByCreatedAtDesc(user);
        return buildCartSummary(items);
    }

    @Transactional
    public CartSummaryDto addToCart(User user, AddToCartRequest request) {
        Product product = productService.getProductEntityById(request.productId());

        if (product.getStockQuantity() < request.quantity()) {
            throw new InsufficientStockException(
                    "Only " + product.getStockQuantity() + " units in stock for '" + product.getName() + "'"
            );
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProduct(user, product);
        if (existingItemOpt.isPresent()) {
            CartItem existing = existingItemOpt.get();
            int newQuantity = existing.getQuantity() + request.quantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new InsufficientStockException(
                        "Cannot add " + request.quantity() + " more units. Total requested (" + newQuantity + ") exceeds available stock (" + product.getStockQuantity() + ")"
                );
            }
            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = new CartItem(user, product, request.quantity());
            cartItemRepository.save(newItem);
        }

        return getCartForUser(user);
    }

    @Transactional
    public CartSummaryDto updateItemQuantity(User user, Long cartItemId, UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to user");
        }

        Product product = cartItem.getProduct();
        if (product.getStockQuantity() < request.quantity()) {
            throw new InsufficientStockException(
                    "Cannot update quantity to " + request.quantity() + ". Available stock is " + product.getStockQuantity()
            );
        }

        cartItem.setQuantity(request.quantity());
        cartItemRepository.save(cartItem);

        return getCartForUser(user);
    }

    @Transactional
    public CartSummaryDto removeItem(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to user");
        }

        cartItemRepository.delete(cartItem);
        return getCartForUser(user);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }

    private CartSummaryDto buildCartSummary(List<CartItem> items) {
        List<CartItemDto> dtoList = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            Product p = item.getProduct();
            BigDecimal effectivePrice = p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getPrice();
            BigDecimal itemSubtotal = effectivePrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            dtoList.add(new CartItemDto(
                    item.getId(),
                    p.getId(),
                    p.getName(),
                    p.getSku(),
                    p.getImageUrl(),
                    effectivePrice,
                    item.getQuantity(),
                    itemSubtotal,
                    p.getStockQuantity()
            ));

            subtotal = subtotal.add(itemSubtotal);
            totalItems += item.getQuantity();
        }

        BigDecimal shipping = BigDecimal.ZERO;
        if (totalItems > 0 && subtotal.compareTo(new BigDecimal("50.00")) < 0) {
            shipping = new BigDecimal("9.99");
        }

        BigDecimal estimatedTax = subtotal.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(shipping).add(estimatedTax).setScale(2, RoundingMode.HALF_UP);

        return new CartSummaryDto(
                dtoList,
                totalItems,
                subtotal.setScale(2, RoundingMode.HALF_UP),
                shipping,
                estimatedTax,
                total
        );
    }
}
