package com.financetracker.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class EmailNormalizerTest {

    @Test
    void lowercasesAndTrimsEmail() {
        assertThat(EmailNormalizer.normalize("  John@Example.COM  ")).isEqualTo("john@example.com");
    }

    @Test
    void nullStaysNull() {
        assertThat(EmailNormalizer.normalize(null)).isNull();
    }
}
