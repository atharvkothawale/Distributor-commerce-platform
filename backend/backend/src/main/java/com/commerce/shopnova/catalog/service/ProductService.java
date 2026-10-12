package com.commerce.shopnova.catalog.service;

import com.commerce.shopnova.catalog.dto.*;
import com.commerce.shopnova.catalog.exception.InsufficientStockException;
import com.commerce.shopnova.catalog.exception.ResourceNotFoundException;
import com.commerce.shopnova.catalog.model.Category;
import com.commerce.shopnova.catalog.model.Product;
import com.commerce.shopnova.catalog.repository.CategoryRepository;
import com.commerce.shopnova.catalog.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Locale;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(String keyword, String categorySlug, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanCategory = (categorySlug != null && !categorySlug.trim().isEmpty()) ? categorySlug.trim() : null;

        return productRepository.searchProducts(cleanKeyword, cleanCategory, minPrice, maxPrice, pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue(pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toDto(product);
    }

    @Transactional(readOnly = true)
    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return toDto(product);
    }

    @Transactional
    public ProductDto createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        Product product = new Product();
        product.setName(request.name().trim());
        product.setSku(request.sku().trim().toUpperCase(Locale.ROOT));
        product.setSlug(generateSlug(request.name()));
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setDiscountPrice(request.discountPrice());
        product.setStockQuantity(request.stockQuantity());
        product.setCategory(category);
        product.setBrand(request.brand());
        product.setImageUrl(request.imageUrl());
        product.setIsFeatured(Boolean.TRUE.equals(request.isFeatured()));
        product.setIsActive(true);

        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (request.name() != null) {
            product.setName(request.name().trim());
            product.setSlug(generateSlug(request.name()));
        }
        if (request.description() != null) product.setDescription(request.description());
        if (request.price() != null) product.setPrice(request.price());
        if (request.discountPrice() != null) product.setDiscountPrice(request.discountPrice());
        if (request.stockQuantity() != null) product.setStockQuantity(request.stockQuantity());
        if (request.brand() != null) product.setBrand(request.brand());
        if (request.imageUrl() != null) product.setImageUrl(request.imageUrl());
        if (request.isFeatured() != null) product.setIsFeatured(request.isFeatured());
        if (request.isActive() != null) product.setIsActive(request.isActive());

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));
            product.setCategory(category);
        }

        Product updated = productRepository.save(product);
        return toDto(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        product.setIsActive(false); // Soft delete
        productRepository.save(product);
    }

    @Transactional
    public StockDeductionResponse deductStock(Long productId, Integer quantity) {
        int updatedRows = productRepository.deductStock(productId, quantity);
        if (updatedRows == 0) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
            throw new InsufficientStockException(
                    "Insufficient stock for product '" + product.getName() + "'. Available: " + product.getStockQuantity() + ", requested: " + quantity
            );
        }

        Product product = productRepository.findById(productId).orElseThrow();
        return new StockDeductionResponse(productId, true, product.getStockQuantity(), "Stock deducted successfully");
    }

    @Transactional
    public StockDeductionResponse replenishStock(Long productId, Integer quantity) {
        productRepository.replenishStock(productId, quantity);
        Product product = productRepository.findById(productId).orElseThrow();
        return new StockDeductionResponse(productId, true, product.getStockQuantity(), "Stock replenished successfully");
    }

    public ProductDto toDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getDiscountPrice(),
                product.getStockQuantity(),
                categoryService.toDto(product.getCategory()),
                product.getBrand(),
                product.getImageUrl(),
                product.getRating(),
                product.getReviewCount(),
                product.getIsFeatured(),
                product.getIsActive(),
                product.getCreatedAt()
        );
    }

    private String generateSlug(String text) {
        return text.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}
