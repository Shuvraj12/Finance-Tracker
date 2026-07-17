package com.financetracker.dto;

import java.math.BigDecimal;

public record MonthlyTrend(int month, int year, String label, BigDecimal income, BigDecimal expenses) {
}
