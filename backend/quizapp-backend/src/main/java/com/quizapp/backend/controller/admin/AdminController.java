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
    public Object getAllQuestions(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page != null && size != null) {
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
            return questionService.getAllQuestionsPaginated(pageable);
        }
        return questionService.getAllQuestions();
    }

    /* =========================
       ADD QUESTION (ADMIN ONLY)
    ========================= */
    @PostMapping("/add")
    public Question addQuestion(@RequestBody Question question) {
        return questionService.addQuestion(question);
    }

    /* =========================
       UPDATE QUESTION (ADMIN ONLY)
    ========================= */
    @PutMapping("/update/{id}")
    public Question updateQuestion(
            @PathVariable Long id,
            @RequestBody Question updatedQuestion) {
        updatedQuestion.setId(id);
        return questionService.addQuestion(updatedQuestion);
    }

    /* =========================
       DELETE QUESTION (ADMIN ONLY)
    ========================= */
    @DeleteMapping("/delete/{id}")
    public String deleteQuestion(@PathVariable Long id) {
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