package com.commerce.shopnova.catalog.service;

import com.commerce.shopnova.catalog.dto.CategoryDto;
import com.commerce.shopnova.catalog.exception.ResourceNotFoundException;
import com.commerce.shopnova.catalog.model.Category;
import com.commerce.shopnova.catalog.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return toDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.name());
        category.setSlug(dto.slug());
        category.setDescription(dto.description());
        category.setImageUrl(dto.imageUrl());
        category.setDisplayOrder(dto.displayOrder() != null ? dto.displayOrder() : 0);

        Category saved = categoryRepository.save(category);
        return toDto(saved);
    }

    public CategoryDto toDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getDisplayOrder()
        );
    }
}
