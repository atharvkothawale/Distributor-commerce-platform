package com.commerce.shopnova.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartSummaryDto(
    List<CartItemDto> items,
    int totalItems,
    BigDecimal subtotal,
    BigDecimal shipping,
    BigDecimal estimatedTax,
    BigDecimal total
) {}
