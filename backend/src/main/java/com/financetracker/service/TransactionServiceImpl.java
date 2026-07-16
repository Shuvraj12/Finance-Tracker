package com.financetracker.service;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.dto.TransactionResponse;
import com.financetracker.entity.Category;
import com.financetracker.entity.Transaction;
import com.financetracker.entity.TransactionType;
import com.financetracker.entity.User;
import com.financetracker.exception.InvalidCategoryException;
import com.financetracker.exception.ResourceNotFoundException;
import com.financetracker.repository.TransactionRepository;
import com.financetracker.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId).stream()
                .map(TransactionResponse::from)
                .toList();
    }

    @Override
    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        validateCategoryForType(request.transactionType(), request.category());

        // A lazy reference is enough here - we only need it to populate the
        // FK column, and userId is already known-good (it came off an
        // authenticated JWT), so there's no need for a real SELECT first.
        User user = userRepository.getReferenceById(userId);

        Transaction transaction = Transaction.builder()
                .amount(request.amount())
                .transactionType(request.transactionType())
                .category(request.category())
                .note(request.note())
                .date(request.date())
                .user(user)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return TransactionResponse.from(saved);
    }

    @Override
    public TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionRequest request) {
        validateCategoryForType(request.transactionType(), request.category());

        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));

        transaction.setAmount(request.amount());
        transaction.setTransactionType(request.transactionType());
        transaction.setCategory(request.category());
        transaction.setNote(request.note());
        transaction.setDate(request.date());

        Transaction updated = transactionRepository.save(transaction);
        return TransactionResponse.from(updated);
    }

    @Override
    public void deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + transactionId));
        transactionRepository.delete(transaction);
    }

    private void validateCategoryForType(TransactionType type, Category category) {
        if (!category.isValidFor(type)) {
            throw new InvalidCategoryException(
                    category + " is not a valid category for " + type + " transactions");
        }
    }
}
