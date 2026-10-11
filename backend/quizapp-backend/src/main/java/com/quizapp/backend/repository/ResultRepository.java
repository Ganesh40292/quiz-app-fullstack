package com.quizapp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quizapp.backend.model.Result;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByUserId(Long userId);

    List<Result> findTop10ByOrderByScoreDesc();

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Result r WHERE r.totalQuestions > 0 ORDER BY r.score DESC")
    List<Result> findTopResultsWithValidQuestions();
}