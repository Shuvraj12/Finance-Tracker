package com.financetracker.dto;

import com.financetracker.entity.Category;
import java.math.BigDecimal;

public record CategoryBreakdown(Category category, BigDecimal total) {
}
