package com.quizapp.backend.service.interfaces;

import java.util.List;

import com.quizapp.backend.model.Quiz;

public interface QuizService {
    List<Quiz> getAllQuizzes();
}