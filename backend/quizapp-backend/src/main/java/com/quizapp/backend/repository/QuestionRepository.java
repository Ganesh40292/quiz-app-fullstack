package com.quizapp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quizapp.backend.model.Question;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategory(String category);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByCategoryAndDifficulty(String category, String difficulty);
}