package com.quizapp.backend.service.interfaces;

import java.util.List;

import com.quizapp.backend.model.Result;

public interface ResultService {
    Result saveResult(Result result);
    List<Result> getResultsByUser(Long userId);
}