package com.commerce.shopnova.order.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
    @NotBlank(message = "Recipient name is required")
    String recipientName,

    @NotBlank(message = "Recipient phone is required")
    String recipientPhone,

    @NotBlank(message = "Shipping address is required")
    String shippingAddress,

    @NotBlank(message = "Payment method is required")
    String paymentMethod, // CARD, UPI, COD

    String cardNumber,
    String cardCvv,
    String cardExpiry
) {}
