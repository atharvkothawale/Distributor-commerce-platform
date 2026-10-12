package com.commerce.shopnova.catalog.dto;

import java.io.Serializable;

public record CategoryDto(
    Long id,
    String name,
    String slug,
    String description,
    String imageUrl,
    Integer displayOrder
) implements Serializable {}
