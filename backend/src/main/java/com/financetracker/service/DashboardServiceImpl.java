package com.financetracker.service;

import com.financetracker.dto.BudgetResponse;
import com.financetracker.dto.CategoryBreakdown;
import com.financetracker.dto.DashboardResponse;
import com.financetracker.dto.MonthlyTrend;
import com.financetracker.dto.TransactionResponse;
import com.financetracker.entity.TransactionType;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.util.MonthlyTrendCalculator;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
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
    private final MonthlyTrendCalculator monthlyTrendCalculator;

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

        List<MonthlyTrend> monthlyTrend = monthlyTrendCalculator.calculate(userId, TREND_MONTHS);

        return new DashboardResponse(totalBalance, totalIncome, totalExpenses, savings, budget,
                recentTransactions, expenseByCategory, monthlyTrend);
    }

    private BigDecimal sumForMonth(Long userId, TransactionType type, YearMonth month) {
        return transactionRepository.sumByUserIdAndTransactionTypeAndDateBetween(
                userId, type, month.atDay(1), month.atEndOfMonth());
    }
}
