package com.quizapp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quizapp.backend.model.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}