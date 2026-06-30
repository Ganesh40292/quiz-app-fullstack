package com.quizapp.backend.controller.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quizapp.backend.model.Question;
import com.quizapp.backend.model.Result;
import com.quizapp.backend.model.User;
import com.quizapp.backend.repository.ResultRepository;
import com.quizapp.backend.repository.UserRepository;
import com.quizapp.backend.config.JwtUtil;
import com.quizapp.backend.service.interfaces.QuestionService;
import java.util.Optional;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /* =========================
       GET ALL / FILTERED QUESTIONS
    ========================= */
    @GetMapping("/questions")
    public List<Question> getQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {
        return questionService.getFilteredQuestions(category, difficulty);
    }

    /* =========================
       SUBMIT QUIZ (CALCULATE SCORE)
    ========================= */
    @PostMapping("/submit")
    public Map<String, Integer> submitQuiz(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<Long, String> answers) {

        List<Question> questions = questionService.getAllQuestions();
        int score = 0;

        for (Question q : questions) {
            String selected = answers.get(q.getId());
            if (selected != null && selected.equalsIgnoreCase(q.getCorrectAnswer())) {
                score++;
            }
        }

        // Save result if user is authenticated
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                Optional<User> optUser = userRepository.findByUsername(username);
                if (optUser.isPresent()) {
                    Result result = new Result();
                    result.setScore(score);
                    result.setTotalQuestions(questions.size());
                    result.setUser(optUser.get());
                    resultRepository.save(result);
                }
            }
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("score", score);
        response.put("total", questions.size());

        return response;
    }

    /* =========================
       LEADERBOARD
    ========================= */
    @GetMapping("/leaderboard")
    public List<Result> getLeaderboard() {
        return resultRepository.findTop10ByOrderByScoreDesc();
    }

    /* =========================
       USER HISTORY
    ========================= */
    @GetMapping("/history")
    public List<Result> getUserHistory(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                Optional<User> optUser = userRepository.findByUsername(username);
                if (optUser.isPresent()) {
                    return resultRepository.findByUserId(optUser.get().getId());
                }
            }
        }
        return List.of();
    }

    // Removed unauthenticated admin endpoints (add, update, delete) to prevent security flaws.

    /* =========================
       DASHBOARD STATS
    ========================= */
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        List<Question> questions = questionService.getAllQuestions();
        long totalUsers = userRepository.count();
        List<Result> results = resultRepository.findAll();
        
        long totalResults = results.size();
        double averageScore = 0.0;
        if (totalResults > 0) {
            double sum = 0;
            for (Result r : results) {
                if (r.getTotalQuestions() > 0) {
                    sum += ((double) r.getScore() / r.getTotalQuestions()) * 100;
                }
            }
            averageScore = sum / totalResults;
        }

        Map<String, Long> categoryDistribution = new HashMap<>();
        Map<String, Long> difficultyDistribution = new HashMap<>();

        for (Question q : questions) {
            String cat = q.getCategory() == null || q.getCategory().isEmpty() ? "General" : q.getCategory();
            categoryDistribution.put(cat, categoryDistribution.getOrDefault(cat, 0L) + 1);

            String diff = q.getDifficulty() == null || q.getDifficulty().isEmpty() ? "Medium" : q.getDifficulty();
            difficultyDistribution.put(diff, difficultyDistribution.getOrDefault(diff, 0L) + 1);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQuestions", questions.size());
        stats.put("totalUsers", totalUsers);
        stats.put("totalResults", totalResults);
        stats.put("averageScore", Math.round(averageScore * 100.0) / 100.0);
        stats.put("categoryDistribution", categoryDistribution);
        stats.put("difficultyDistribution", difficultyDistribution);

        return stats;
    }
}