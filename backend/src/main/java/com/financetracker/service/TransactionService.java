package com.financetracker.service;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.dto.TransactionResponse;
import java.util.List;

public interface TransactionService {

    List<TransactionResponse> getAllTransactions(Long userId);

    TransactionResponse createTransaction(Long userId, TransactionRequest request);

    TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionRequest request);

    void deleteTransaction(Long userId, Long transactionId);
}
