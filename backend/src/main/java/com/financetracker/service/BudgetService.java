package com.financetracker.service;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetResponse;
import java.util.Optional;

public interface BudgetService {

    /**
     * month/year are nullable - null means "the current month". Returns
     * empty rather than throwing when nothing is set, so callers that treat
     * "no budget yet" as a normal state (like the dashboard) don't have to
     * catch an exception for it.
     */
    Optional<BudgetResponse> findBudget(Long userId, Integer month, Integer year);

    /**
     * Same lookup as findBudget, but throws when nothing is set - what the
     * dedicated GET /api/budget endpoint wants, since a missing budget there
     * is a genuine 404.
     */
    BudgetResponse getBudget(Long userId, Integer month, Integer year);

    BudgetResponse createBudget(Long userId, BudgetRequest request);

    BudgetResponse updateBudget(Long userId, BudgetRequest request);
}
