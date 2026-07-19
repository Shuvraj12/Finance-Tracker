package com.financetracker.util;

/**
 * Emails are normalized to lowercase before any lookup or write. Most MySQL
 * default collations are already case-insensitive, so this may not fix an
 * actively broken behavior on a typical setup - but the app shouldn't rely
 * on that collation detail to be correct, so this makes it explicit instead.
 */
public final class EmailNormalizer {

    private EmailNormalizer() {
    }

    public static String normalize(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
