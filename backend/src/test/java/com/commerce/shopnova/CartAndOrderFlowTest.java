package com.commerce.shopnova;

import com.commerce.shopnova.auth.model.User;
import com.commerce.shopnova.auth.repository.UserRepository;
import com.commerce.shopnova.cart.dto.AddToCartRequest;
import com.commerce.shopnova.cart.dto.CartSummaryDto;
import com.commerce.shopnova.cart.service.CartService;
import com.commerce.shopnova.catalog.exception.InsufficientStockException;
import com.commerce.shopnova.catalog.model.Product;
import com.commerce.shopnova.catalog.repository.ProductRepository;
import com.commerce.shopnova.order.dto.CheckoutRequest;
import com.commerce.shopnova.order.dto.OrderDto;
import com.commerce.shopnova.order.model.OrderStatus;
import com.commerce.shopnova.order.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb_flow;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class CartAndOrderFlowTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    @DisplayName("Should successfully add product to cart, check out, deduct stock, and empty cart")
    void testCompleteCartAndCheckoutFlow() {
        User customer = userRepository.findByEmail("customer@shopnova.com")
                .orElseThrow();
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() > 5)
                .findFirst()
                .orElseThrow();

        int initialStock = product.getStockQuantity();

        // 1. Add 2 items to cart
        CartSummaryDto cart = cartService.addToCart(customer, new AddToCartRequest(product.getId(), 2));
        assertNotNull(cart);
        assertEquals(2, cart.totalItems());
        assertEquals(1, cart.items().size());

        // 2. Perform checkout with mock payment
        CheckoutRequest checkoutReq = new CheckoutRequest(
                "Jane Doe",
                "+91 91234 56789",
                "123 MG Road, Bangalore 560001",
                "CARD",
                "4111222233334444",
                "123",
                "12/28"
        );

        OrderDto order = orderService.checkout(customer, checkoutReq);

        assertNotNull(order);
        assertNotNull(order.orderNumber());
        assertTrue(order.orderNumber().startsWith("ORD-"));
        assertEquals(OrderStatus.CONFIRMED, order.status());
        assertEquals("COMPLETED", order.paymentStatus());
        assertEquals(1, order.items().size());
        assertEquals(2, order.items().get(0).quantity());

        // 3. Verify inventory is deducted in database
        Product updatedProduct = productRepository.findById(product.getId()).orElseThrow();
        assertEquals(initialStock - 2, updatedProduct.getStockQuantity());

        // 4. Verify cart is now empty
        CartSummaryDto postCheckoutCart = cartService.getCartForUser(customer);
        assertEquals(0, postCheckoutCart.totalItems());
        assertTrue(postCheckoutCart.items().isEmpty());
    }

    @Test
    @DisplayName("Should reject adding to cart when requested quantity exceeds available inventory")
    void testStockExceededRejection() {
        User customer = userRepository.findByEmail("customer@shopnova.com").orElseThrow();
        Product product = productRepository.findAll().get(0);

        int excessQuantity = product.getStockQuantity() + 500;

        assertThrows(InsufficientStockException.class, () ->
                cartService.addToCart(customer, new AddToCartRequest(product.getId(), excessQuantity))
        );
    }
}
