package com.financetracker.repository;

import com.financetracker.entity.Transaction;
import com.financetracker.entity.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    /**
     * Used for every single-transaction read/update/delete. Scoping the
     * lookup by userId here (not just checking ownership after an id-only
     * fetch) means a user can never even detect whether another user's
     * transaction id exists - it's a clean 404 either way.
     */
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    /**
     * Backs the Budget feature's "spent so far" figure. Uses a plain date
     * range (BETWEEN) rather than wrapping the column in YEAR()/MONTH()
     * functions - that keeps the query portable across DB dialects and lets
     * an index on `date` actually be used, which a function-wrapped column
     * usually can't. COALESCE guards against SUM returning NULL when there
     * are no matching rows yet.
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.user.id = :userId AND t.transactionType = :type AND t.date BETWEEN :start AND :end")
    BigDecimal sumByUserIdAndTransactionTypeAndDateBetween(@Param("userId") Long userId,
                                                             @Param("type") TransactionType type,
                                                             @Param("start") LocalDate start,
                                                             @Param("end") LocalDate end);
}

