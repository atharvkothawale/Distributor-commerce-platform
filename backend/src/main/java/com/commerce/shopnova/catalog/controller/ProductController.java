package com.commerce.shopnova.catalog.controller;

import com.commerce.shopnova.catalog.dto.*;
import com.commerce.shopnova.catalog.service.ProductService;
import com.commerce.shopnova.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Catalog & Inventory", description = "Endpoints for discovering products, faceted search, and atomic inventory management")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Search and filter products", description = "Full-text search across title, brand, and description with category and price filters")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {

        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        String property = sortParams[0];

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, property));
        Page<ProductDto> result = productService.searchProducts(keyword, category, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products", description = "Retrieves high-priority products for homepage lightning deals and hero carousels")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getFeaturedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rating"));
        return ResponseEntity.ok(ApiResponse.ok(productService.getFeaturedProducts(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Fetches complete product specifications by internal ID")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductById(id)));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get product by slug", description = "Fetches product by SEO-friendly canonical slug")
    public ResponseEntity<ApiResponse<ProductDto>> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProductBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create product", description = "Admin endpoint to publish a new product to the catalog")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDto created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Product created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product", description = "Admin endpoint to modify pricing, description, or stock")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@PathVariable Long id, @RequestBody UpdateProductRequest request) {
        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product", description = "Admin endpoint to soft-delete product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deactivated successfully", null));
    }

    @PostMapping("/{id}/deduct-stock")
    @Operation(summary = "Deduct product stock atomically", description = "Concurrency-safe stock deduction")
    public ResponseEntity<ApiResponse<StockDeductionResponse>> deductStock(
            @PathVariable Long id,
            @Valid @RequestBody StockDeductionRequest request) {
        StockDeductionResponse response = productService.deductStock(id, request.quantity());
        return ResponseEntity.ok(ApiResponse.ok("Stock deducted successfully", response));
    }

    @PostMapping("/{id}/replenish-stock")
    @Operation(summary = "Replenish product stock", description = "Releases reserved stock back to inventory")
    public ResponseEntity<ApiResponse<StockDeductionResponse>> replenishStock(
            @PathVariable Long id,
            @Valid @RequestBody StockDeductionRequest request) {
        StockDeductionResponse response = productService.replenishStock(id, request.quantity());
        return ResponseEntity.ok(ApiResponse.ok("Stock replenished successfully", response));
    }
}
