package com.commerce.shopnova.cart.dto;

import java.math.BigDecimal;

public record CartItemDto(
    Long id,
    Long productId,
    String productName,
    String productSku,
    String productImageUrl,
    BigDecimal price,
    Integer quantity,
    BigDecimal subtotal,
    Integer availableStock
) {}
