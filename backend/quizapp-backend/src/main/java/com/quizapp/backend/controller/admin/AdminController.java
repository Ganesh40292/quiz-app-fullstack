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
    private final com.quizapp.backend.repository.UserRepository userRepository;
    private final com.quizapp.backend.repository.ResultRepository resultRepository;

    /* =========================
       CONSTRUCTOR INJECTION
    ========================= */
    public AdminController(
            QuestionService questionService,
            com.quizapp.backend.repository.UserRepository userRepository,
            com.quizapp.backend.repository.ResultRepository resultRepository) {
        this.questionService = questionService;
        this.userRepository = userRepository;
        this.resultRepository = resultRepository;
    }

    /* =========================
       GET ALL QUESTIONS (WITH OPTIONAL SEARCH, CATEGORY & DIFFICULTY FILTERS)
    ========================= */
    @GetMapping("/questions")
    public Object getAllQuestions(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {
        if (page != null && size != null) {
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
            return questionService.searchFilteredPaginated(search, category, difficulty, pageable);
        }
        return questionService.getAllQuestions();
    }

    /* =========================
       GET ALL REGISTERED USERS (ADMIN ONLY)
    ========================= */
    @GetMapping("/users")
    public List<com.quizapp.backend.dto.response.UserSummaryDto> getAllUsers() {
        List<com.quizapp.backend.model.User> users = userRepository.findAll(
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id")
        );

        List<com.quizapp.backend.dto.response.UserSummaryDto> summaryList = new java.util.ArrayList<>();

        for (com.quizapp.backend.model.User user : users) {
            List<com.quizapp.backend.model.Result> userResults = resultRepository.findByUserId(user.getId());
            long totalQuizzes = userResults.size();
            int highestScore = userResults.stream()
                    .mapToInt(com.quizapp.backend.model.Result::getScore)
                    .max()
                    .orElse(0);

            summaryList.add(new com.quizapp.backend.dto.response.UserSummaryDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getCreatedAt(),
                    totalQuizzes,
                    highestScore
            ));
        }

        return summaryList;
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
       MODERATION: APPROVE QUESTION
    ========================= */
    @PutMapping("/approve/{id}")
    public Question approveQuestion(@PathVariable Long id) {
        return questionService.updateStatus(id, "APPROVED");
    }

    /* =========================
       MODERATION: REJECT QUESTION
    ========================= */
    @PutMapping("/reject/{id}")
    public Question rejectQuestion(@PathVariable Long id) {
        return questionService.updateStatus(id, "REJECTED");
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