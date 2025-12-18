package com.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login response containing authentication token and user info
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private boolean success;
    private String token;
    private String email;
    private String name;
    private String role;
    private String error;

    /**
     * Create a successful login response
     */
    public static LoginResponse success(String token, String email, String name, String role) {
        return LoginResponse.builder()
                .success(true)
                .token(token)
                .email(email)
                .name(name)
                .role(role)
                .build();
    }

    /**
     * Create a failed login response
     */
    public static LoginResponse failure(String error) {
        return LoginResponse.builder()
                .success(false)
                .error(error)
                .build();
    }
}
