package com.financetracker.dto;

/**
 * Returned by both /api/auth/register and /api/auth/login. Includes basic
 * profile info alongside the token so the frontend can populate AuthContext
 * without an extra round trip.
 */
public record AuthResponse(
        String token,
        String type,
        Long id,
        String name,
        String email
) {
    public AuthResponse(String token, Long id, String name, String email) {
        this(token, "Bearer", id, name, email);
    }
}
