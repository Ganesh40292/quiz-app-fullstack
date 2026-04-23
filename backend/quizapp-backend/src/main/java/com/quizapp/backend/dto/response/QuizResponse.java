package com.quizapp.backend.dto.response;

import java.util.List;

public class QuizResponse {

    private Long questionId;
    private String question;
    private List<String> options;

    public QuizResponse() {}

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }
}