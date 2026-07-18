package com.financetracker.service;

import com.financetracker.dto.CategoryBreakdown;
import com.financetracker.dto.MonthlyTrend;
import com.financetracker.dto.ReportPeriod;
import com.financetracker.dto.ReportResponse;
import com.financetracker.entity.TransactionType;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.util.MonthlyTrendCalculator;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private static final int TREND_MONTHS = 12;

    private final TransactionRepository transactionRepository;
    private final MonthlyTrendCalculator monthlyTrendCalculator;

    @Override
    public ReportResponse getReport(Long userId, ReportPeriod period) {
        DateRange range = resolveDateRange(period);

        BigDecimal totalIncome = transactionRepository.sumByUserIdAndTransactionTypeAndDateBetween(
                userId, TransactionType.INCOME, range.start(), range.end());
        BigDecimal totalExpenses = transactionRepository.sumByUserIdAndTransactionTypeAndDateBetween(
                userId, TransactionType.EXPENSE, range.start(), range.end());

        List<CategoryBreakdown> categoryDistribution = transactionRepository
                .sumByCategoryForUserAndTypeAndDateBetween(
                        userId, TransactionType.EXPENSE, range.start(), range.end());

        // Independent of `period` on purpose - always a fixed 12-month
        // window so the trend chart doesn't jump around as the filter above
        // it changes.
        List<MonthlyTrend> monthlyTrend = monthlyTrendCalculator.calculate(userId, TREND_MONTHS);

        return new ReportResponse(period.name(), range.start(), range.end(), totalIncome, totalExpenses,
                categoryDistribution, monthlyTrend);
    }

    private DateRange resolveDateRange(ReportPeriod period) {
        LocalDate today = LocalDate.now();
        return switch (period) {
            case TODAY -> new DateRange(today, today);
            case WEEK -> new DateRange(today.minusDays(6), today);
            case MONTH -> {
                YearMonth ym = YearMonth.from(today);
                yield new DateRange(ym.atDay(1), ym.atEndOfMonth());
            }
            case YEAR -> new DateRange(today.withDayOfYear(1), today.withDayOfYear(today.lengthOfYear()));
        };
    }

    private record DateRange(LocalDate start, LocalDate end) {
    }
}
