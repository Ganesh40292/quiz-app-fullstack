package com.quizapp.backend.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quizapp.backend.model.Result;
import com.quizapp.backend.repository.ResultRepository;
import com.quizapp.backend.service.interfaces.ResultService;

@Service
public class ResultServiceImpl implements ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Override
    public Result saveResult(Result result) {
        return resultRepository.save(result);
    }

    @Override
    public List<Result> getResultsByUser(Long userId) {
        return resultRepository.findByUserId(userId);
    }
}