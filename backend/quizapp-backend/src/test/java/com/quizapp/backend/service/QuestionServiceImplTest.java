package com.quizapp.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.quizapp.backend.model.Question;
import com.quizapp.backend.repository.QuestionRepository;
import com.quizapp.backend.service.impl.QuestionServiceImpl;

@ExtendWith(MockitoExtension.class)
public class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    private Question q1;
    private Question q2;

    @BeforeEach
    void setUp() {
        q1 = new Question("Q1", "A", "B", "C", "D", "A", "Java", "Easy");
        q1.setId(1L);
        q2 = new Question("Q2", "A", "B", "C", "D", "B", "Java", "Medium");
        q2.setId(2L);
    }

    @Test
    void testGetAllQuestions() {
        when(questionRepository.findAll()).thenReturn(Arrays.asList(q1, q2));

        List<Question> questions = questionService.getAllQuestions();

        assertEquals(2, questions.size());
        verify(questionRepository, times(1)).findAll();
    }

    @Test
    void testGetQuestionById() {
        when(questionRepository.findById(1L)).thenReturn(Optional.of(q1));

        Question found = questionService.getQuestionById(1L);

        assertNotNull(found);
        assertEquals("Q1", found.getQuestion());
    }

    @Test
    void testDeleteQuestion() {
        when(questionRepository.existsById(1L)).thenReturn(true);
        doNothing().when(questionRepository).deleteById(1L);

        assertDoesNotThrow(() -> questionService.deleteQuestion(1L));

        verify(questionRepository, times(1)).deleteById(1L);
    }
}
