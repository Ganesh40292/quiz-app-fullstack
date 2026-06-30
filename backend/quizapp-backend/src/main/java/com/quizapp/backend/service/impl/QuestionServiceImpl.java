package com.quizapp.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quizapp.backend.model.Question;
import com.quizapp.backend.repository.QuestionRepository;
import com.quizapp.backend.service.interfaces.QuestionService;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    /* =========================
       ADD / UPDATE QUESTION
    ========================= */
    @Override
    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    /* =========================
       GET ALL QUESTIONS
    ========================= */
    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    /* =========================
       GET FILTERED QUESTIONS
    ========================= */
    @Override
    public List<Question> getFilteredQuestions(String category, String difficulty) {
        if (category != null && !category.isEmpty() && difficulty != null && !difficulty.isEmpty()) {
            return questionRepository.findByCategoryAndDifficulty(category, difficulty);
        } else if (category != null && !category.isEmpty()) {
            return questionRepository.findByCategory(category);
        } else if (difficulty != null && !difficulty.isEmpty()) {
            return questionRepository.findByDifficulty(difficulty);
        } else {
            return questionRepository.findAll();
        }
    }

    /* =========================
       DELETE QUESTION
    ========================= */
    @Override
    public void deleteQuestion(Long id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Question not found with id: " + id);
        }
    }

    /* =========================
       GET QUESTION BY ID
    ========================= */
    @Override
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElse(null);
    }

    /* =========================
       GET PAGINATED QUESTIONS
    ========================= */
    @Override
    public org.springframework.data.domain.Page<Question> getAllQuestionsPaginated(org.springframework.data.domain.Pageable pageable) {
        return questionRepository.findAll(pageable);
    }
}