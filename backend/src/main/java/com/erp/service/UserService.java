package com.erp.service;

import com.erp.dto.UserRequest;
import com.erp.dto.UserResponse;
import com.erp.entity.Role;
import com.erp.entity.User;
import com.erp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing users
 */
@Service
@SuppressWarnings("null")
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Get all users
     */
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create a new user
     */
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (request.getEmail() == null || userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists or is invalid: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    /**
     * Update user role
     */
    @Transactional
    public UserResponse updateUserRole(Long id, Role role) {
        if (id == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setRole(role);
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    /**
     * Delete a user
     */
    @Transactional
    public void deleteUser(Long id) {
        if (id == null || !userRepository.existsById(id)) {
            throw new RuntimeException("User not found or ID is null");
        }
        userRepository.deleteById(id);
    }

    private UserResponse mapToResponse(User user) {
        if (user == null)
            return null;
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
