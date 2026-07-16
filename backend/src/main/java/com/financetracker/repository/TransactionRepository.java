package com.financetracker.repository;

import com.financetracker.entity.Transaction;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    /**
     * Used for every single-transaction read/update/delete. Scoping the
     * lookup by userId here (not just checking ownership after an id-only
     * fetch) means a user can never even detect whether another user's
     * transaction id exists - it's a clean 404 either way.
     */
    Optional<Transaction> findByIdAndUserId(Long id, Long userId);
}
