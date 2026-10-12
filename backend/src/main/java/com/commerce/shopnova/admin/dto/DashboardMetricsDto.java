package com.commerce.shopnova.admin.dto;

import java.math.BigDecimal;
import java.util.Map;

public record DashboardMetricsDto(
    BigDecimal totalRevenue,
    long totalOrders,
    long totalCustomers,
    long totalProducts,
    long lowStockProducts,
    Map<String, Long> ordersByStatus
) {}
