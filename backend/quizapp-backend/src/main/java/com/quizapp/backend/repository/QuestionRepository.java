package com.quizapp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quizapp.backend.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}