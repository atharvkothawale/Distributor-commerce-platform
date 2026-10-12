package com.commerce.shopnova.order.dto;

import java.math.BigDecimal;

public record OrderItemDto(
    Long id,
    Long productId,
    String productName,
    String productSku,
    String productImageUrl,
    BigDecimal price,
    Integer quantity,
    BigDecimal subtotal
) {}
