package com.commerce.shopnova.order.dto;

import com.commerce.shopnova.order.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
    @NotNull(message = "Order status is required")
    OrderStatus status
) {}
