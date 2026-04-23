package com.quizapp.backend.controller.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> req) {

        String username = req.get("username");
        String password = req.get("password");

        Map<String, Object> res = new HashMap<>();

        // 🔐 ADMIN
        if ("admin".equalsIgnoreCase(username) && "Admin@123".equals(password)) {
            res.put("status", "success");
            res.put("role", "admin");
            res.put("token", "admin-token");
            res.put("username", "admin");
            return res;
        }

        // 👤 USER
        if ("user".equalsIgnoreCase(username) && "User@123".equals(password)) {
            res.put("status", "success");
            res.put("role", "user");
            res.put("token", "user-token");
            res.put("username", "user");
            return res;
        }

        // ❌ INVALID
        res.put("status", "fail");
        res.put("message", "Invalid credentials");

        return res;
    }
}