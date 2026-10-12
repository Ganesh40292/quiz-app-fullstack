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
       ADD / UPDATE QUESTION (WITH CONTENT GUARDRAILS)
    ========================= */
    @Override
    public Question addQuestion(Question question) {
        if (question == null) {
            throw new IllegalArgumentException("Question cannot be null");
        }

        // 1. Text normalization & duplicate checking for new questions
        String questionText = question.getQuestion() != null ? question.getQuestion().trim() : "";
        if (questionText.length() < 8) {
            throw new IllegalArgumentException("Question text must be at least 8 characters long.");
        }

        if (question.getId() == null && questionRepository.existsByQuestionIgnoreCase(questionText)) {
            throw new IllegalArgumentException("Duplicate question detected! A question with this exact text already exists.");
        }

        // 2. Option uniqueness guard (prevent spam like A: test, B: test)
        if (question.getOptionA() == null || question.getOptionB() == null ||
            question.getOptionC() == null || question.getOptionD() == null) {
            throw new IllegalArgumentException("All 4 options (A, B, C, D) are required.");
        }

        java.util.Set<String> uniqueOptions = new java.util.HashSet<>();
        uniqueOptions.add(question.getOptionA().trim().toLowerCase());
        uniqueOptions.add(question.getOptionB().trim().toLowerCase());
        uniqueOptions.add(question.getOptionC().trim().toLowerCase());
        uniqueOptions.add(question.getOptionD().trim().toLowerCase());

        if (uniqueOptions.size() < 4) {
            throw new IllegalArgumentException("Question options must be unique. Duplicate choices are not allowed.");
        }

        // 3. Correct answer validation
        if (question.getCorrectAnswer() == null || question.getCorrectAnswer().trim().isEmpty()) {
            throw new IllegalArgumentException("Correct answer is required.");
        }
        String cleanAnswer = question.getCorrectAnswer().trim().toUpperCase();
        if (!java.util.List.of("A", "B", "C", "D").contains(cleanAnswer) &&
            !cleanAnswer.equalsIgnoreCase(question.getOptionA().trim()) &&
            !cleanAnswer.equalsIgnoreCase(question.getOptionB().trim()) &&
            !cleanAnswer.equalsIgnoreCase(question.getOptionC().trim()) &&
            !cleanAnswer.equalsIgnoreCase(question.getOptionD().trim())) {
            throw new IllegalArgumentException("Correct answer must be one of [A, B, C, D] or match one of the option texts.");
        }

        // 4. Moderation status default
        if (question.getStatus() == null || question.getStatus().trim().isEmpty()) {
            question.setStatus("APPROVED");
        } else {
            question.setStatus(question.getStatus().trim().toUpperCase());
        }

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
       GET FILTERED QUESTIONS (SERVING ONLY APPROVED QUESTIONS)
    ========================= */
    @Override
    public List<Question> getFilteredQuestions(String category, String difficulty) {
        String activeStatus = "APPROVED";
        if (category != null && !category.isEmpty() && difficulty != null && !difficulty.isEmpty()) {
            return questionRepository.findByCategoryAndDifficultyAndStatus(category, difficulty, activeStatus);
        } else if (category != null && !category.isEmpty()) {
            return questionRepository.findByCategoryAndStatus(category, activeStatus);
        } else if (difficulty != null && !difficulty.isEmpty()) {
            return questionRepository.findByDifficultyAndStatus(difficulty, activeStatus);
        } else {
            return questionRepository.findByStatus(activeStatus);
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
       UPDATE QUESTION STATUS (MODERATION)
    ========================= */
    @Override
    public Question updateStatus(Long id, String status) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new com.quizapp.backend.exception.ResourceNotFoundException("Question not found with id: " + id));

        String normalized = (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : "APPROVED";
        question.setStatus(normalized);
        return questionRepository.save(question);
    }

    /* =========================
       GET PAGINATED QUESTIONS
    ========================= */
    @Override
    public org.springframework.data.domain.Page<Question> getAllQuestionsPaginated(org.springframework.data.domain.Pageable pageable) {
        return questionRepository.findAll(pageable);
    }

    /* =========================
       SEARCH PAGINATED QUESTIONS
    ========================= */
    @Override
    public org.springframework.data.domain.Page<Question> searchQuestionsPaginated(String search, org.springframework.data.domain.Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return questionRepository.findAll(pageable);
        }
        return questionRepository.findByQuestionContainingIgnoreCase(search.trim(), pageable);
    }

    /* =========================
       SEARCH & FILTER PAGINATED QUESTIONS
    ========================= */
    @Override
    public org.springframework.data.domain.Page<Question> searchFilteredPaginated(String search, String category, String difficulty, org.springframework.data.domain.Pageable pageable) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String cleanCat = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) ? category.trim() : null;
        String cleanDiff = (difficulty != null && !difficulty.trim().isEmpty() && !difficulty.equalsIgnoreCase("All")) ? difficulty.trim() : null;

        return questionRepository.searchFilteredPaginated(cleanSearch, cleanCat, cleanDiff, pageable);
    }
}