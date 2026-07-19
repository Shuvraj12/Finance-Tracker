package com.financetracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * currentPassword is required on every update, even when only name/email are
 * changing - re-confirming identity before ANY profile change is the safer
 * default, especially since email doubles as the account's login identifier.
 * newPassword is optional; leave it null/blank to keep the existing password.
 */
public record ProfileUpdateRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid email address")
        String email,

        @NotBlank(message = "Current password is required")
        String currentPassword,

        @Size(min = 8, message = "New password must be at least 8 characters")
        String newPassword
) {
}
