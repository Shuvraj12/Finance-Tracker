package com.financetracker.service;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetResponse;

public interface BudgetService {

    /**
     * month/year are nullable - null means "the current month".
     */
    BudgetResponse getBudget(Long userId, Integer month, Integer year);

    BudgetResponse createBudget(Long userId, BudgetRequest request);

    BudgetResponse updateBudget(Long userId, BudgetRequest request);
}
