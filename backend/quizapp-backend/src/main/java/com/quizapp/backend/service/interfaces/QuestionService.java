package com.quizapp.backend.service.interfaces;

import java.util.List;

import com.quizapp.backend.model.Question;

public interface QuestionService {

    /* =========================
       ADD / UPDATE QUESTION
    ========================= */
    Question addQuestion(Question question);

    /* =========================
       GET ALL QUESTIONS
    ========================= */
    List<Question> getAllQuestions();

    /* =========================
       GET FILTERED QUESTIONS
    ========================= */
    List<Question> getFilteredQuestions(String category, String difficulty);

    /* =========================
       DELETE QUESTION
    ========================= */
    void deleteQuestion(Long id);

    /* =========================
       GET QUESTION BY ID (for edit support)
    ========================= */
    Question getQuestionById(Long id);

    /* =========================
       GET PAGINATED QUESTIONS
    ========================= */
    org.springframework.data.domain.Page<Question> getAllQuestionsPaginated(org.springframework.data.domain.Pageable pageable);
}