package com.financetracker.repository;

import com.financetracker.entity.Budget;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);
}
