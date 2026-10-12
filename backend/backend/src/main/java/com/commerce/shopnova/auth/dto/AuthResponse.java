package com.commerce.shopnova.auth.dto;

public record AuthResponse(
    String token,
    String type,
    Long userId,
    String fullName,
    String email,
    String role,
    long expiresInMs
) {
    public static AuthResponse of(String token, Long userId, String fullName, String email, String role, long expiresInMs) {
        return new AuthResponse(token, "Bearer", userId, fullName, email, role, expiresInMs);
    }
}
