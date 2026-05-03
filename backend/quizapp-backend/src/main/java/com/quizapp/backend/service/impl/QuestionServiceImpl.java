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
}