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
import com.quizapp.backend.dto.response.QuestionDto;
import java.util.stream.Collectors;
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
       GET ALL / FILTERED QUESTIONS (SANITIZED DTO)
    ========================= */
    @GetMapping("/questions")
    public List<QuestionDto> getQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {
        return questionService.getFilteredQuestions(category, difficulty)
                .stream()
                .map(QuestionDto::new)
                .collect(Collectors.toList());
    }

    /* =========================
       CHECK SINGLE ANSWER (PRACTICE / CHALLENGE LIVE FEEDBACK)
    ========================= */
    @PostMapping("/check-answer")
    public Map<String, Object> checkAnswer(@RequestBody Map<String, Object> req) {
        Map<String, Object> res = new HashMap<>();
        if (req == null || !req.containsKey("questionId")) {
            res.put("correct", false);
            return res;
        }

        Long questionId = Long.valueOf(req.get("questionId").toString());
        String selected = req.get("answer") != null ? req.get("answer").toString().trim() : "";

        Question q = questionService.getQuestionById(questionId);
        if (q != null) {
            boolean isCorrect = selected.equalsIgnoreCase(q.getCorrectAnswer().trim());
            res.put("correct", isCorrect);
            res.put("correctAnswer", q.getCorrectAnswer().trim());
        } else {
            res.put("correct", false);
        }
        return res;
    }

    /* =========================
       SUBMIT QUIZ (CALCULATE SCORE & RETURN REVIEW DATA)
    ========================= */
    @PostMapping("/submit")
    public Map<String, Object> submitQuiz(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<Long, String> answers) {

        int score = 0;
        int total = answers != null ? answers.size() : 0;
        Map<Long, String> correctAnswers = new HashMap<>();

        if (answers != null && !answers.isEmpty()) {
            for (Map.Entry<Long, String> entry : answers.entrySet()) {
                Question q = questionService.getQuestionById(entry.getKey());
                if (q != null) {
                    correctAnswers.put(q.getId(), q.getCorrectAnswer());
                    if (entry.getValue() != null && !entry.getValue().trim().isEmpty()) {
                        if (entry.getValue().trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                            score++;
                        }
                    }
                }
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
                    result.setTotalQuestions(total);
                    result.setUser(optUser.get());
                    resultRepository.save(result);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("total", total);
        response.put("correctAnswers", correctAnswers);

        return response;
    }

    /* =========================
       LEADERBOARD
    ========================= */
    @GetMapping("/leaderboard")
    public List<Result> getLeaderboard() {
        return resultRepository.findTopResultsWithValidQuestions();
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
        long validResultsCount = 0;
        if (totalResults > 0) {
            double sum = 0;
            for (Result r : results) {
                if (r.getTotalQuestions() > 0) {
                    sum += ((double) r.getScore() / r.getTotalQuestions()) * 100;
                    validResultsCount++;
                }
            }
            if (validResultsCount > 0) {
                averageScore = sum / validResultsCount;
            }
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