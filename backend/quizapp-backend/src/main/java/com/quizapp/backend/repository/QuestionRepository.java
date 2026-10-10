package com.quizapp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quizapp.backend.model.Question;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategory(String category);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByCategoryAndDifficulty(String category, String difficulty);

    // 🛡️ Moderation Status Queries
    List<Question> findByStatus(String status);
    List<Question> findByCategoryAndStatus(String category, String status);
    List<Question> findByDifficultyAndStatus(String difficulty, String status);
    List<Question> findByCategoryAndDifficultyAndStatus(String category, String difficulty, String status);

    // 🔍 Duplicate Question Guard
    boolean existsByQuestionIgnoreCase(String question);

    // 🔍 Global Paginated Search
    org.springframework.data.domain.Page<Question> findByQuestionContainingIgnoreCase(String question, org.springframework.data.domain.Pageable pageable);
}