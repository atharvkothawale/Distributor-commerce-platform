package com.commerce.shopnova.catalog.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public record ProductDto(
    Long id,
    String name,
    String sku,
    String slug,
    String description,
    BigDecimal price,
    BigDecimal discountPrice,
    Integer stockQuantity,
    CategoryDto category,
    String brand,
    String imageUrl,
    Double rating,
    Integer reviewCount,
    Boolean isFeatured,
    Boolean isActive,
    Instant createdAt
) implements Serializable {}
