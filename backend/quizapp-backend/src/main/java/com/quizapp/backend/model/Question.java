package com.quizapp.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "questions", indexes = {
    @Index(name = "idx_question_category", columnList = "category"),
    @Index(name = "idx_question_difficulty", columnList = "difficulty"),
    @Index(name = "idx_question_status", columnList = "status")
})
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Question text cannot be blank")
    @Size(min = 8, max = 1000, message = "Question text must be between 8 and 1000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @NotBlank(message = "Option A is required")
    @Size(min = 1, max = 255, message = "Option A must be between 1 and 255 characters")
    @Column(name = "option_a", nullable = false)
    private String optionA;

    @NotBlank(message = "Option B is required")
    @Size(min = 1, max = 255, message = "Option B must be between 1 and 255 characters")
    @Column(name = "option_b", nullable = false)
    private String optionB;

    @NotBlank(message = "Option C is required")
    @Size(min = 1, max = 255, message = "Option C must be between 1 and 255 characters")
    @Column(name = "option_c", nullable = false)
    private String optionC;

    @NotBlank(message = "Option D is required")
    @Size(min = 1, max = 255, message = "Option D must be between 1 and 255 characters")
    @Column(name = "option_d", nullable = false)
    private String optionD;

    @NotBlank(message = "Correct answer is required")
    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    @Column(name = "category")
    private String category;

    @Column(name = "difficulty")
    private String difficulty;

    // 🛡️ MODERATION STATUS: PENDING_REVIEW, APPROVED, REJECTED
    @Column(name = "status", nullable = false)
    private String status = "APPROVED";

    /* =========================
       CONSTRUCTORS
    ========================= */
    public Question() {}

    public Question(String question, String optionA, String optionB,
                    String optionC, String optionD, String correctAnswer,
                    String category, String difficulty) {
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
        this.category = category;
        this.difficulty = difficulty;
    }

    /* =========================
       GETTERS & SETTERS
    ========================= */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}