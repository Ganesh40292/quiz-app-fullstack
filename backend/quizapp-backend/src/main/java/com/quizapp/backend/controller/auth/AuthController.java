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

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

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

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            res.put("status", "fail");
            res.put("message", "Username already exists");
            return res;
        }

        // Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Default role is "user" unless explicitly passed as "admin"
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user");
        }

        userRepository.save(user);

        res.put("status", "success");
        res.put("message", "User registered successfully");
        return res;
    }
}