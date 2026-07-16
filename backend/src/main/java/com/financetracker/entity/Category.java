package com.financetracker.entity;

/**
 * One enum shared by both transaction types instead of two separate
 * IncomeCategory/ExpenseCategory enums - each constant declares which
 * TransactionType it's valid for, so that rule lives in exactly one place
 * (see isValidFor) rather than being re-implemented wherever categories are
 * used. OTHERS applies to both income and expenses.
 */
public enum Category {
    FOOD(TransactionType.EXPENSE),
    TRANSPORT(TransactionType.EXPENSE),
    SHOPPING(TransactionType.EXPENSE),
    BILLS(TransactionType.EXPENSE),
    ENTERTAINMENT(TransactionType.EXPENSE),
    MEDICAL(TransactionType.EXPENSE),
    RENT(TransactionType.EXPENSE),
    SALARY(TransactionType.INCOME),
    FREELANCING(TransactionType.INCOME),
    INVESTMENTS(TransactionType.INCOME),
    BONUS(TransactionType.INCOME),
    OTHERS(null);

    private final TransactionType applicableType;

    Category(TransactionType applicableType) {
        this.applicableType = applicableType;
    }

    public boolean isValidFor(TransactionType type) {
        return applicableType == null || applicableType == type;
    }
}
