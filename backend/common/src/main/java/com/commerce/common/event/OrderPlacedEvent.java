package com.commerce.common.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderPlacedEvent(
    Long orderId,
    Long userId,
    String userEmail,
    BigDecimal totalAmount,
    List<OrderItemDto> items,
    Instant createdAt
) {
    public record OrderItemDto(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice
    ) {}
}
