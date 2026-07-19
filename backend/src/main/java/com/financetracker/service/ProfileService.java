package com.financetracker.service;

import com.financetracker.dto.AuthResponse;
import com.financetracker.dto.DeleteAccountRequest;
import com.financetracker.dto.ProfileUpdateRequest;

public interface ProfileService {

    /**
     * Returns a fresh token, since email (the JWT subject) may have just
     * changed - the token the caller was holding could otherwise go stale
     * the moment this call completes.
     */
    AuthResponse updateProfile(Long userId, ProfileUpdateRequest request);

    void deleteAccount(Long userId, DeleteAccountRequest request);
}
