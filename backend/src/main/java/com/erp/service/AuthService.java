package com.erp.service;

import com.erp.dto.LoginRequest;
import com.erp.dto.LoginResponse;
import com.erp.entity.Role;
import com.erp.entity.User;
import com.erp.repository.UserRepository;
import com.erp.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

/**
 * Authentication service handling login and user validation
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;

    }

    /**
     * Authenticate user and generate JWT token
     *
     * @param request Login request containing email, password, and expected role
     * @return LoginResponse with token on success, or error message on failure
     */
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {} with role: {}", request.getEmail(), request.getRole());

        try {
            // Find user by email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElse(null);

            if (user == null) {
                log.warn("Login failed - user not found: {}", request.getEmail());
                return LoginResponse.failure("Invalid email or password. Please try again.");
            }

            // Validate role matches
            Role expectedRole = Role.valueOf(request.getRole().toUpperCase());
            if (user.getRole() != expectedRole) {
                log.warn("Login failed - role mismatch for user: {}. Expected: {}, Actual: {}",
                        request.getEmail(), expectedRole, user.getRole());
                return LoginResponse.failure(
                        "Invalid credentials for " + request.getRole()
                                + " access. Please select the correct login type.");
            }

            // Authenticate with Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            // Generate JWT token
            String token = jwtService.generateToken(user);

            log.info("Login successful for user: {} with role: {}", request.getEmail(), user.getRole());

            return LoginResponse.success(
                    token,
                    user.getEmail(),
                    user.getName(),
                    user.getRole().name());

        } catch (BadCredentialsException e) {
            log.warn("Login failed - bad credentials for: {}", request.getEmail());
            return LoginResponse.failure("Invalid email or password. Please try again.");
        } catch (IllegalArgumentException e) {
            log.warn("Login failed - invalid role: {}", request.getRole());
            return LoginResponse.failure("Invalid role specified.");
        } catch (Exception e) {
            log.error("Login failed with unexpected error for: {}", request.getEmail(), e);
            return LoginResponse.failure("An unexpected error occurred. Please try again.");
        }
    }

    /**
     * Validate a JWT token
     *
     * @param token JWT token to validate
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            String email = jwtService.extractUsername(token);
            User user = userRepository.findByEmail(email).orElse(null);
            return user != null && jwtService.isTokenValid(token, user);
        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}
