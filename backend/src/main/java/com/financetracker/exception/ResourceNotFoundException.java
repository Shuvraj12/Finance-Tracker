package com.financetracker.exception;

/**
 * Generic "couldn't find that" exception. Not used by Phase 2 itself, but
 * added now since GlobalExceptionHandler needs to know about it and every
 * later phase (transactions, budget) will throw it for lookups by id.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
