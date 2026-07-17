package com.financetracker.service;

import com.financetracker.dto.BudgetResponse;
import com.financetracker.dto.CategoryBreakdown;
import com.financetracker.dto.DashboardResponse;
import com.financetracker.dto.MonthlyTrend;
import com.financetracker.dto.TransactionResponse;
import com.financetracker.entity.TransactionType;
import com.financetracker.repository.TransactionRepository;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private static final int TREND_MONTHS = 6;

    private final TransactionRepository transactionRepository;
    private final BudgetService budgetService;

    @Override
    public DashboardResponse getDashboard(Long userId) {
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndTransactionType(userId, TransactionType.INCOME);
        BigDecimal totalExpenses =
                transactionRepository.sumByUserIdAndTransactionType(userId, TransactionType.EXPENSE);
        BigDecimal totalBalance = totalIncome.subtract(totalExpenses);

        YearMonth currentMonth = YearMonth.now();
        BigDecimal monthIncome = sumForMonth(userId, TransactionType.INCOME, currentMonth);
        BigDecimal monthExpenses = sumForMonth(userId, TransactionType.EXPENSE, currentMonth);
        BigDecimal savings = monthIncome.subtract(monthExpenses);

        // findBudget (not getBudget) - a missing budget is normal data here,
        // not a 404, so the dashboard can render fine without one set yet.
        BudgetResponse budget = budgetService.findBudget(userId, null, null).orElse(null);

        List<TransactionResponse> recentTransactions = transactionRepository
                .findTop5ByUserIdOrderByDateDesc(userId).stream()
                .map(TransactionResponse::from)
                .toList();

        List<CategoryBreakdown> expenseByCategory = transactionRepository
                .sumByCategoryForUserAndTypeAndDateBetween(
                        userId, TransactionType.EXPENSE, currentMonth.atDay(1), currentMonth.atEndOfMonth());

        List<MonthlyTrend> monthlyTrend = buildMonthlyTrend(userId, currentMonth);

        return new DashboardResponse(totalBalance, totalIncome, totalExpenses, savings, budget,
                recentTransactions, expenseByCategory, monthlyTrend);
    }

    private BigDecimal sumForMonth(Long userId, TransactionType type, YearMonth month) {
        return transactionRepository.sumByUserIdAndTransactionTypeAndDateBetween(
                userId, type, month.atDay(1), month.atEndOfMonth());
    }

    private List<MonthlyTrend> buildMonthlyTrend(Long userId, YearMonth currentMonth) {
        List<MonthlyTrend> trend = new ArrayList<>();
        for (int i = TREND_MONTHS - 1; i >= 0; i--) {
            YearMonth ym = currentMonth.minusMonths(i);
            BigDecimal income = sumForMonth(userId, TransactionType.INCOME, ym);
            BigDecimal expenses = sumForMonth(userId, TransactionType.EXPENSE, ym);
            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + ym.getYear();
            trend.add(new MonthlyTrend(ym.getMonthValue(), ym.getYear(), label, income, expenses));
        }
        return trend;
    }
}
