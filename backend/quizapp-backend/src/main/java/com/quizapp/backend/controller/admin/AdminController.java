package com.quizapp.backend.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.quizapp.backend.model.Question;
import com.quizapp.backend.service.interfaces.QuestionService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final QuestionService questionService;

    /* =========================
       CONSTRUCTOR INJECTION
    ========================= */
    public AdminController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /* =========================
       GET ALL QUESTIONS
    ========================= */
    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    /* =========================
       ADD QUESTION (ADMIN ONLY)
    ========================= */
    @PostMapping("/add")
    public Question addQuestion(
            @RequestHeader("role") String role,
            @RequestBody Question question) {

        if (!"admin".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access Denied ❌");
        }

        return questionService.addQuestion(question);
    }

    /* =========================
       UPDATE QUESTION (ADMIN ONLY)
    ========================= */
    @PutMapping("/update/{id}")
    public Question updateQuestion(
            @RequestHeader("role") String role,
            @PathVariable Long id,
            @RequestBody Question updatedQuestion) {

        if (!"admin".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access Denied ❌");
        }

        updatedQuestion.setId(id);
        return questionService.addQuestion(updatedQuestion);
    }

    /* =========================
       DELETE QUESTION (ADMIN ONLY)
    ========================= */
    @DeleteMapping("/delete/{id}")
    public String deleteQuestion(
            @RequestHeader("role") String role,
            @PathVariable Long id) {

        if (!"admin".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access Denied ❌");
        }

        questionService.deleteQuestion(id);
        return "Question deleted successfully";
    }

    /* =========================
       DASHBOARD CHECK
    ========================= */
    @GetMapping("/dashboard")
    public String dashboard() {
        return "Admin Dashboard Running ✅";
    }
}