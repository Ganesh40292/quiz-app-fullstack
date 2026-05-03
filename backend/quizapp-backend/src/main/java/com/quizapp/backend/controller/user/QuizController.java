package com.quizapp.backend.controller.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quizapp.backend.model.Question;
import com.quizapp.backend.service.interfaces.QuestionService;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuestionService questionService;

    /* =========================
       GET ALL QUESTIONS
    ========================= */
    @GetMapping("/questions")
    public List<Question> getQuestions() {
        return questionService.getAllQuestions();
    }

    /* =========================
       SUBMIT QUIZ (CALCULATE SCORE)
    ========================= */
    @PostMapping("/submit")
    public Map<String, Integer> submitQuiz(@RequestBody Map<Long, String> answers) {

        List<Question> questions = questionService.getAllQuestions();
        int score = 0;

        for (Question q : questions) {
            String selected = answers.get(q.getId());

            if (selected != null &&
                selected.equalsIgnoreCase(q.getCorrectAnswer())) {
                score++;
            }
        }

        // 🔥 return JSON instead of plain int (better for frontend)
        Map<String, Integer> response = new HashMap<>();
        response.put("score", score);
        response.put("total", questions.size());

        return response;
    }

    // Removed unauthenticated admin endpoints (add, update, delete) to prevent security flaws.

    /* =========================
       DASHBOARD STATS
    ========================= */
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        List<Question> questions = questionService.getAllQuestions();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQuestions", questions.size());

        return stats;
    }
}