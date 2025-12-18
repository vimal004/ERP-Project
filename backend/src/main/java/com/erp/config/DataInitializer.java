package com.erp.config;

import com.erp.entity.Role;
import com.erp.entity.User;
import com.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Data initialization configuration for development/demo purposes
 * Creates default admin and user accounts on application startup
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    /**
     * Initialize default users on application startup
     * Matches the mock users from the frontend:
     * - admin@company.com / admin123 (Admin)
     * - user@company.com / user123 (User)
     */
    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository) {
        return args -> {
            // Create Admin user if not exists
            if (!userRepository.existsByEmail("admin@company.com")) {
                User admin = User.builder()
                        .name("System Administrator")
                        .email("admin@company.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .isActive(true)
                        .build();
                userRepository.save(admin);
                log.info("Created default admin user: admin@company.com");
            }

            // Create Staff/User if not exists
            if (!userRepository.existsByEmail("user@company.com")) {
                User user = User.builder()
                        .name("Staff User")
                        .email("user@company.com")
                        .password(passwordEncoder.encode("user123"))
                        .role(Role.USER)
                        .isActive(true)
                        .build();
                userRepository.save(user);
                log.info("Created default staff user: user@company.com");
            }

            log.info("Data initialization complete. Total users: {}", userRepository.count());
        };
    }
}
