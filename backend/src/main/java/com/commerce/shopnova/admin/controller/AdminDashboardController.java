package com.commerce.shopnova.admin.controller;

import com.commerce.shopnova.admin.dto.DashboardMetricsDto;
import com.commerce.shopnova.auth.dto.UserProfileResponse;
import com.commerce.shopnova.auth.repository.UserRepository;
import com.commerce.shopnova.catalog.repository.ProductRepository;
import com.commerce.shopnova.common.ApiResponse;
import com.commerce.shopnova.order.dto.OrderDto;
import com.commerce.shopnova.order.dto.UpdateOrderStatusRequest;
import com.commerce.shopnova.order.model.OrderStatus;
import com.commerce.shopnova.order.repository.OrderRepository;
import com.commerce.shopnova.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administration Console", description = "Privileged endpoints for KPI analytics, inventory auditing, and order management")
public class AdminDashboardController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    public AdminDashboardController(OrderRepository orderRepository,
                                    ProductRepository productRepository,
                                    UserRepository userRepository,
                                    OrderService orderService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderService = orderService;
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get admin dashboard KPI metrics", description = "Calculates total revenue, order count, customer volume, and low stock counts")
    public ResponseEntity<ApiResponse<DashboardMetricsDto>> getMetrics() {
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        long totalOrders = orderRepository.count();
        long totalCustomers = userRepository.count();
        long totalProducts = productRepository.count();

        // Low stock count (< 20 units)
        long lowStockCount = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() < 20)
                .count();

        Map<String, Long> statusMap = new HashMap<>();
        for (OrderStatus s : OrderStatus.values()) {
            statusMap.put(s.name(), orderRepository.countByStatus(s));
        }

        DashboardMetricsDto dto = new DashboardMetricsDto(
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                totalOrders,
                totalCustomers,
                totalProducts,
                lowStockCount,
                statusMap
        );

        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all customer orders", description = "Retrieves paginated orders for administration and fulfillment tracking")
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrders(pageable)));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status", description = "Transitions order state machine (e.g. CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED)")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderDto updated = orderService.updateOrderStatus(id, request.status());
        return ResponseEntity.ok(ApiResponse.ok("Order status updated to " + request.status(), updated));
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered accounts", description = "Fetches user directory for identity audit")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = userRepository.findAll().stream()
                .map(u -> new UserProfileResponse(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getRole(),
                        u.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(users));
    }
}
