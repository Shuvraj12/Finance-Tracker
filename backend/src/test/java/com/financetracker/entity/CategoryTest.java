package com.financetracker.entity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CategoryTest {

    @Test
    void expenseCategoryIsNotValidForIncome() {
        assertThat(Category.FOOD.isValidFor(TransactionType.EXPENSE)).isTrue();
        assertThat(Category.FOOD.isValidFor(TransactionType.INCOME)).isFalse();
    }

    @Test
    void incomeCategoryIsNotValidForExpense() {
        assertThat(Category.SALARY.isValidFor(TransactionType.INCOME)).isTrue();
        assertThat(Category.SALARY.isValidFor(TransactionType.EXPENSE)).isFalse();
    }

    @Test
    void othersIsValidForBothTypes() {
        assertThat(Category.OTHERS.isValidFor(TransactionType.INCOME)).isTrue();
        assertThat(Category.OTHERS.isValidFor(TransactionType.EXPENSE)).isTrue();
    }
}
