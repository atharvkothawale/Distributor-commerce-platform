package com.commerce.shopnova.cart.controller;

import com.commerce.shopnova.auth.model.User;
import com.commerce.shopnova.auth.service.AuthService;
import com.commerce.shopnova.cart.dto.AddToCartRequest;
import com.commerce.shopnova.cart.dto.CartSummaryDto;
import com.commerce.shopnova.cart.dto.UpdateCartItemRequest;
import com.commerce.shopnova.cart.service.CartService;
import com.commerce.shopnova.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart", description = "Endpoints for managing persistent shopping cart items and subtotals")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    public CartController(CartService cartService, AuthService authService) {
        this.cartService = cartService;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "Get current cart", description = "Retrieves cart items, item counts, estimated taxes, and order total for authenticated user")
    public ResponseEntity<ApiResponse<CartSummaryDto>> getCart(Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCartForUser(user)));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Appends product to cart with stock validation")
    public ResponseEntity<ApiResponse<CartSummaryDto>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        CartSummaryDto updatedCart = cartService.addToCart(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", updatedCart));
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Update item quantity", description = "Modifies quantity for a specific cart line item")
    public ResponseEntity<ApiResponse<CartSummaryDto>> updateQuantity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        CartSummaryDto updatedCart = cartService.updateItemQuantity(user, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Quantity updated", updatedCart));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove item from cart", description = "Deletes a specific line item from cart")
    public ResponseEntity<ApiResponse<CartSummaryDto>> removeItem(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        CartSummaryDto updatedCart = cartService.removeItem(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", updatedCart));
    }

    @DeleteMapping
    @Operation(summary = "Clear shopping cart", description = "Removes all items from the current user's shopping cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(Authentication authentication) {
        User user = authService.getUserEntityByEmail(authentication.getName());
        cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", null));
    }
}
