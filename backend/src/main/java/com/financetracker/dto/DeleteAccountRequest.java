package com.financetracker.dto;

import jakarta.validation.constraints.NotBlank;

public record DeleteAccountRequest(

        @NotBlank(message = "Current password is required to delete your account")
        String currentPassword
) {
}
