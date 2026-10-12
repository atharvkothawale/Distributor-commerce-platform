package com.commerce.shopnova;

import com.commerce.shopnova.auth.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import static org.junit.jupiter.api.Assertions.*;

class JwtSecurityProfileTest {

    @Test
    @DisplayName("Dev profile allows development fallback secret")
    void testDevProfileAllowsFallbackSecret() {
        MockEnvironment devEnv = new MockEnvironment();
        devEnv.setActiveProfiles("dev");

        JwtTokenProvider provider = new JwtTokenProvider(
                JwtTokenProvider.DEV_FALLBACK_SECRET,
                86400000L,
                devEnv
        );

        String token = provider.generateToken(1L, "user@test.com", "ROLE_CUSTOMER", "Test User");
        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("user@test.com", provider.getEmailFromToken(token));
    }

    @Test
    @DisplayName("Prod profile fails startup when development fallback secret is used")
    void testProdProfileRejectsFallbackSecret() {
        MockEnvironment prodEnv = new MockEnvironment();
        prodEnv.setActiveProfiles("prod");

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                new JwtTokenProvider(
                        JwtTokenProvider.DEV_FALLBACK_SECRET,
                        86400000L,
                        prodEnv
                )
        );

        assertTrue(ex.getMessage().contains("Development fallback secret cannot be used in production"));
    }

    @Test
    @DisplayName("Prod profile fails startup when secret is missing or insecure (< 32 chars)")
    void testProdProfileRejectsShortSecret() {
        MockEnvironment prodEnv = new MockEnvironment();
        prodEnv.setActiveProfiles("production");

        assertThrows(IllegalStateException.class, () ->
                new JwtTokenProvider(
                        "too-short-secret",
                        86400000L,
                        prodEnv
                )
        );
    }

    @Test
    @DisplayName("Prod profile succeeds with secure 32+ char secret")
    void testProdProfileAcceptsSecureSecret() {
        MockEnvironment prodEnv = new MockEnvironment();
        prodEnv.setActiveProfiles("prod");

        String secureProdSecret = "ThisIsAStrongProductionSecretKeyForShopNovaEcommerce2026!";
        JwtTokenProvider provider = new JwtTokenProvider(
                secureProdSecret,
                86400000L,
                prodEnv
        );

        String token = provider.generateToken(10L, "admin@shopnova.com", "ROLE_ADMIN", "Admin User");
        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("admin@shopnova.com", provider.getEmailFromToken(token));
    }
}
