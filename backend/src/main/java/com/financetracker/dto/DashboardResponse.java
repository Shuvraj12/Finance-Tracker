package com.financetracker.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * budget is null when nothing has been set for the current month yet - not
 * an error state, the frontend shows a "set a budget" prompt for it instead.
 */
public record DashboardResponse(
        BigDecimal totalBalance,
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal savings,
        BudgetResponse budget,
        List<TransactionResponse> recentTransactions,
        List<CategoryBreakdown> expenseByCategory,
        List<MonthlyTrend> monthlyTrend
) {
}
