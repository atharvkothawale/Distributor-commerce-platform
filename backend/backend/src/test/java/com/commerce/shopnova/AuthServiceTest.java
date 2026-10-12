package com.commerce.shopnova;

import com.commerce.shopnova.auth.dto.AuthResponse;
import com.commerce.shopnova.auth.dto.LoginRequest;
import com.commerce.shopnova.auth.dto.RegisterRequest;
import com.commerce.shopnova.auth.exception.EmailAlreadyExistsException;
import com.commerce.shopnova.auth.exception.InvalidCredentialsException;
import com.commerce.shopnova.auth.service.AuthService;
import com.commerce.shopnova.common.SecurityConstants;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb_auth;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Should register a new customer successfully and return JWT token")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
                "Alice Smith",
                "alice@example.com",
                "Password@123",
                SecurityConstants.ROLE_CUSTOMER
        );

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.token());
        assertEquals("alice@example.com", response.email());
        assertEquals("Alice Smith", response.fullName());
        assertEquals(SecurityConstants.ROLE_CUSTOMER, response.role());
    }

    @Test
    @DisplayName("Should throw EmailAlreadyExistsException on duplicate registration")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest(
                "Bob Jones",
                "bob@example.com",
                "Password@123",
                SecurityConstants.ROLE_CUSTOMER
        );

        authService.register(request);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
    }

    @Test
    @DisplayName("Should authenticate valid user and throw on invalid credentials")
    void testLoginFlow() {
        RegisterRequest reg = new RegisterRequest(
                "Charlie Brown",
                "charlie@example.com",
                "Secret@123",
                SecurityConstants.ROLE_CUSTOMER
        );
        authService.register(reg);

        AuthResponse loginRes = authService.login(new LoginRequest("charlie@example.com", "Secret@123"));
        assertNotNull(loginRes);
        assertNotNull(loginRes.token());

        assertThrows(InvalidCredentialsException.class, () ->
                authService.login(new LoginRequest("charlie@example.com", "WrongPassword!"))
        );
    }
}
