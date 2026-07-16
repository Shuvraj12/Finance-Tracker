package com.financetracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FinanceTrackerApplicationTests {

    @Test
    void contextLoads() {
        // Confirms the full Spring application context wires up correctly
        // (beans, JPA, Security) against the in-memory H2 database configured
        // in src/test/resources/application.yml.
    }

}
