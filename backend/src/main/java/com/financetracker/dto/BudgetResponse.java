package com.financetracker.dto;

import java.math.BigDecimal;

/**
 * spent/remaining/exceeded are computed by BudgetServiceImpl from actual
 * transactions, not stored - this stays derived data, never a second source
 * of truth that could drift from the transactions table.
 */
public record BudgetResponse(
        Long id,
        BigDecimal amount,
        Integer month,
        Integer year,
        BigDecimal spent,
        BigDecimal remaining,
        boolean exceeded
) {
}
