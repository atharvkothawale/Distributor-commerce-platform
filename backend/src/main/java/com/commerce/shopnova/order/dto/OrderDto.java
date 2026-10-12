package com.commerce.shopnova.order.dto;

import com.commerce.shopnova.order.model.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderDto(
    Long id,
    String orderNumber,
    String customerEmail,
    String recipientName,
    String recipientPhone,
    String shippingAddress,
    String paymentMethod,
    String paymentTransactionId,
    String paymentStatus,
    OrderStatus status,
    BigDecimal subtotal,
    BigDecimal shippingCost,
    BigDecimal taxAmount,
    BigDecimal totalAmount,
    List<OrderItemDto> items,
    Instant createdAt
) {}
