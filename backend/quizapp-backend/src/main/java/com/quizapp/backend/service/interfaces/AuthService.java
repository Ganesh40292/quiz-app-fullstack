package com.quizapp.backend.service.interfaces;

import com.quizapp.backend.model.User;

public interface AuthService {
    User register(User user);
    User login(String username, String password);
}