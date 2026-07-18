package com.financetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * monthlyTrend is always the last 12 calendar months regardless of `period`
 * - it's a fixed-window trend, not something the Today/Week/Month/Year
 * filter narrows further. totalIncome/totalExpenses and
 * categoryDistribution are the ones actually scoped to [startDate, endDate].
 */
public record ReportResponse(
        String period,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        List<CategoryBreakdown> categoryDistribution,
        List<MonthlyTrend> monthlyTrend
) {
}
