package com.commerce.shopnova.order.controller;

import com.commerce.shopnova.auth.model.User;
import com.commerce.shopnova.auth.service.AuthService;
import com.commerce.shopnova.common.ApiResponse;
import com.commerce.shopnova.order.dto.CheckoutRequest;
import com.commerce.shopnova.order.dto.OrderDto;
import com.commerce.shopnova.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Lifecycle & Checkout", description = "Endpoints for placing orders with mock payments and tracking order history")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    public OrderController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @PostMapping("/checkout")
    @Operation(summary = "Place order from cart", description = "Executes checkout, deducts inventory, simulates payment, and creates confirmed order")
    public ResponseEntity<ApiResponse<OrderDto>> checkout(
            @Valid @RequestBody CheckoutRequest request,
            Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        OrderDto order = orderService.checkout(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully", order));
    }

    @GetMapping
    @Operation(summary = "Get user order history", description = "Retrieves all past orders placed by the currently logged-in customer")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getUserOrders(Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(orderService.getUserOrders(user)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details", description = "Fetches complete item breakdown and delivery tracking for an order")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderById(id, user)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order", description = "Cancels order if not delivered and releases inventory back to catalog")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled", orderService.cancelOrder(id, user)));
    }
}
