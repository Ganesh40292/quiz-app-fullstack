package com.quizapp.backend.config;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.quizapp.backend.model.User;
import com.quizapp.backend.repository.UserRepository;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 🔐 The 5 Authorized Admin Accounts & Passwords
    public static final Map<String, String> AUTHORIZED_ADMINS = Map.of(
            "Admin_main", "admin",
            "admin", "admin12",
            "hello", "admin_user",
            "Controller", "Sigma@123",
            "creator", "Creator@123"
    );

    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Initializing the 5 Authorized Admin accounts...");

        for (Map.Entry<String, String> entry : AUTHORIZED_ADMINS.entrySet()) {
            String username = entry.getKey();
            String rawPassword = entry.getValue();
            String email = username.toLowerCase() + "@quizora.admin";

            Optional<User> existingUser = userRepository.findByUsername(username);

            if (existingUser.isPresent()) {
                User user = existingUser.get();
                user.setPassword(passwordEncoder.encode(rawPassword));
                user.setRole("ADMIN");
                user.setEmail(email);
                userRepository.save(user);
                logger.info("Updated authorized admin account: {}", username);
            } else {
                User user = new User();
                user.setUsername(username);
                user.setPassword(passwordEncoder.encode(rawPassword));
                user.setRole("ADMIN");
                user.setEmail(email);
                userRepository.save(user);
                logger.info("Created authorized admin account: {}", username);
            }
        }

        logger.info("All 5 Authorized Admin accounts successfully provisioned with ADMIN role.");
    }
}
