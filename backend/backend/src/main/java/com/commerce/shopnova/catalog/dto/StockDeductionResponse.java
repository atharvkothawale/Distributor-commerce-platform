package com.commerce.shopnova.catalog.dto;

public record StockDeductionResponse(
    Long productId,
    boolean success,
    Integer remainingStock,
    String message
) {}
