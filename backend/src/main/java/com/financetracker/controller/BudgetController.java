package com.financetracker.controller;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetResponse;
import com.financetracker.security.UserPrincipal;
import com.financetracker.service.BudgetService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
@Validated
public class BudgetController {

    private final BudgetService budgetService;

    /**
     * No {id} here on purpose - a budget is identified by (user, month,
     * year), not an opaque id, and month/year default to the current month
     * when omitted so the common case is just GET /api/budget.
     */
    @GetMapping
    public ResponseEntity<BudgetResponse> getBudget(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) @Min(1) @Max(12) Integer month,
            @RequestParam(required = false) @Min(2000) @Max(2100) Integer year) {
        return ResponseEntity.ok(budgetService.getBudget(principal.getId(), month, year));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@AuthenticationPrincipal UserPrincipal principal,
                                                         @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.createBudget(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<BudgetResponse> updateBudget(@AuthenticationPrincipal UserPrincipal principal,
                                                         @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(principal.getId(), request));
    }
}
