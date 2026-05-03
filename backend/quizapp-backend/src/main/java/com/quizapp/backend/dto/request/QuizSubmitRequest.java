package com.quizapp.backend.dto.request;

import java.util.List;

public class QuizSubmitRequest {

    private Long userId;
    private List<Long> questionIds;
    private List<String> answers;

    public QuizSubmitRequest() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<Long> questionIds) {
        this.questionIds = questionIds;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }
}