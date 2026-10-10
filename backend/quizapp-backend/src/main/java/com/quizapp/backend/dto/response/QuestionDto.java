package com.quizapp.backend.dto.response;

import com.quizapp.backend.model.Question;

/**
 * Sanitized Question Data Transfer Object.
 * Prevents client-side answer leakage (CWE-200) by omitting correctAnswer during test taking.
 */
public class QuestionDto {

    private Long id;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String category;
    private String difficulty;

    public QuestionDto() {}

    public QuestionDto(Question q) {
        if (q != null) {
            this.id = q.getId();
            this.question = q.getQuestion();
            this.optionA = q.getOptionA();
            this.optionB = q.getOptionB();
            this.optionC = q.getOptionC();
            this.optionD = q.getOptionD();
            this.category = q.getCategory();
            this.difficulty = q.getDifficulty();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }

    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }

    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }

    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
}
