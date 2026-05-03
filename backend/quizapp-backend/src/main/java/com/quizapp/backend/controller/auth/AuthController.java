package com.quizapp.backend.controller.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import com.quizapp.backend.config.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {

        String username = req.get("username");
        String password = req.get("password");

        Map<String, Object> res = new HashMap<>();

        // 🔐 ADMIN
        if ("admin".equalsIgnoreCase(username) && "Admin@123".equals(password)) {
            res.put("status", "success");
            res.put("role", "admin");
            res.put("token", jwtUtil.generateToken(username));
            res.put("username", "admin");
            return res;
        }

        // 👤 USER
        if ("user".equalsIgnoreCase(username) && "User@123".equals(password)) {
            res.put("status", "success");
            res.put("role", "user");
            res.put("token", jwtUtil.generateToken(username));
            res.put("username", "user");
            return res;
        }

        // ❌ INVALID
        res.put("status", "fail");
        res.put("message", "Invalid credentials");

        return res;
    }
}