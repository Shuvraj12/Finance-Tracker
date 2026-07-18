package com.financetracker.util;

import com.financetracker.dto.MonthlyTrend;
import com.financetracker.entity.TransactionType;
import com.financetracker.repository.TransactionRepository;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Not annotated @Transactional itself - it's always invoked from within an
 * already-transactional service method (Dashboard, Reports), so it just
 * joins that transaction rather than needing to own one.
 */
@Component
@RequiredArgsConstructor
public class MonthlyTrendCalculator {

    private final TransactionRepository transactionRepository;

    public List<MonthlyTrend> calculate(Long userId, int monthsBack) {
        YearMonth currentMonth = YearMonth.now();
        List<MonthlyTrend> trend = new ArrayList<>();

        for (int i = monthsBack - 1; i >= 0; i--) {
            YearMonth ym = currentMonth.minusMonths(i);
            BigDecimal income = transactionRepository.sumByUserIdAndTransactionTypeAndDateBetween(
                    userId, TransactionType.INCOME, ym.atDay(1), ym.atEndOfMonth());
            BigDecimal expenses = transactionRepository.sumByUserIdAndTransactionTypeAndDateBetween(
                    userId, TransactionType.EXPENSE, ym.atDay(1), ym.atEndOfMonth());
            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + ym.getYear();
            trend.add(new MonthlyTrend(ym.getMonthValue(), ym.getYear(), label, income, expenses));
        }

        return trend;
    }
}
