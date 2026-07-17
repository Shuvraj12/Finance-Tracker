package com.financetracker.service;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetResponse;
import com.financetracker.entity.Budget;
import com.financetracker.entity.TransactionType;
import com.financetracker.entity.User;
import com.financetracker.exception.BudgetAlreadyExistsException;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.repository.UserRepository;
import java.math.BigDecimal;
import java.time.YearMonth;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public BudgetResponse getBudget(Long userId, Integer month, Integer year) {
        YearMonth target = resolveYearMonth(month, year);
        Budget budget = budgetRepository
                .findByUserIdAndMonthAndYear(userId, target.getMonthValue(), target.getYear())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No budget set for " + target.getMonthValue() + "/" + target.getYear()));
        return buildResponse(budget, userId);
    }

    @Override
    public BudgetResponse createBudget(Long userId, BudgetRequest request) {
        budgetRepository.findByUserIdAndMonthAndYear(userId, request.month(), request.year())
                .ifPresent(existing -> {
                    throw new BudgetAlreadyExistsException(
                            "A budget for " + request.month() + "/" + request.year()
                                    + " already exists - use PUT to edit it");
                });

        // A lazy reference is enough - we only need it to populate the FK,
        // and userId is already known-good since it came off an
        // authenticated JWT.
        User user = userRepository.getReferenceById(userId);

        Budget budget = Budget.builder()
                .amount(request.amount())
                .month(request.month())
                .year(request.year())
                .user(user)
                .build();

        Budget saved = budgetRepository.save(budget);
        return buildResponse(saved, userId);
    }

    @Override
    public BudgetResponse updateBudget(Long userId, BudgetRequest request) {
        Budget budget = budgetRepository.findByUserIdAndMonthAndYear(userId, request.month(), request.year())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No budget set for " + request.month() + "/" + request.year()
                                + " yet - use POST to create one"));

        budget.setAmount(request.amount());
        Budget updated = budgetRepository.save(budget);
        return buildResponse(updated, userId);
    }

    private BudgetResponse buildResponse(Budget budget, Long userId) {
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        BigDecimal spent = transactionRepository.sumByUserIdAndTransactionTypeAndDateBetween(
                userId, TransactionType.EXPENSE, ym.atDay(1), ym.atEndOfMonth());
        BigDecimal remaining = budget.getAmount().subtract(spent);
        boolean exceeded = spent.compareTo(budget.getAmount()) > 0;

        return new BudgetResponse(
                budget.getId(), budget.getAmount(), budget.getMonth(), budget.getYear(),
                spent, remaining, exceeded
        );
    }

    private YearMonth resolveYearMonth(Integer month, Integer year) {
        YearMonth now = YearMonth.now();
        int resolvedMonth = month != null ? month : now.getMonthValue();
        int resolvedYear = year != null ? year : now.getYear();
        return YearMonth.of(resolvedYear, resolvedMonth);
    }
}
