package com.quizapp.backend.controller.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import com.quizapp.backend.config.JwtUtil;

import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.quizapp.backend.model.User;
import com.quizapp.backend.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");

        Map<String, Object> res = new HashMap<>();

        // 1. Find user by username
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // 2. Check if password matches
            if (passwordEncoder.matches(password, user.getPassword())) {
                res.put("status", "success");
                res.put("role", user.getRole());
                res.put("token", jwtUtil.generateToken(username));
                res.put("username", user.getUsername());
                return res;
            }
        }

        // ❌ INVALID
        res.put("status", "fail");
        res.put("message", "Invalid credentials");
        return res;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> res = new HashMap<>();

        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            res.put("status", "fail");
            res.put("message", "Username and password are required");
            return res;
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            res.put("status", "fail");
            res.put("message", "Username already exists");
            return res;
        }

        // Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Assign role (ADMIN if specified or if username starts with 'admin', otherwise USER)
        if (user.getRole() != null && user.getRole().equalsIgnoreCase("ADMIN")) {
            user.setRole("ADMIN");
        } else if (user.getUsername() != null && user.getUsername().toLowerCase().startsWith("admin")) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        // Default email if not provided (satisfy DB NOT NULL constraint)
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            user.setEmail(user.getUsername().toLowerCase().replaceAll("\\s+", "") + "@gmail.com");
        }

        userRepository.save(user);

        res.put("status", "success");
        res.put("message", "User registered successfully");
        return res;
    }

    @PostMapping("/google")
    public Map<String, Object> googleAuth(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String name = req.get("name");

        Map<String, Object> res = new HashMap<>();

        if (email == null || email.trim().isEmpty()) {
            res.put("status", "fail");
            res.put("message", "Email is required for Google Authentication");
            return res;
        }

        String cleanEmail = email.trim().toLowerCase();

        // 1. Check if user already exists by Email
        Optional<User> existingUser = userRepository.findAll().stream()
                .filter(u -> u.getEmail() != null && cleanEmail.equalsIgnoreCase(u.getEmail().trim()))
                .findFirst();

        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // 2. Derive sanitized base username from name or email
            String baseUsername = (name != null && !name.trim().isEmpty())
                    ? name.trim().replaceAll("[^a-zA-Z0-9]", "")
                    : cleanEmail.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");

            if (baseUsername.isEmpty()) {
                baseUsername = "googleuser";
            }

            // 3. Ensure unique username in database
            String finalUsername = baseUsername;
            int counter = 1;
            while (userRepository.findByUsername(finalUsername).isPresent()) {
                finalUsername = baseUsername + counter++;
            }

            // Auto-create new Google User
            user = new User();
            user.setUsername(finalUsername);
            user.setEmail(cleanEmail);
            user.setPassword(passwordEncoder.encode("GOOGLE_OAUTH_" + System.currentTimeMillis()));
            user.setRole("USER");
            userRepository.save(user);
        }

        res.put("status", "success");
        res.put("role", user.getRole());
        res.put("token", jwtUtil.generateToken(user.getUsername()));
        res.put("username", user.getUsername());
        res.put("email", user.getEmail());
        return res;
    }
}