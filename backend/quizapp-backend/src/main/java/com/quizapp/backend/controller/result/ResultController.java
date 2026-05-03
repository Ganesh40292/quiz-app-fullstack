package com.quizapp.backend.controller.result;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/result")
@CrossOrigin("*")
public class ResultController {

    @GetMapping("/{userId}")
    public String getResult(@PathVariable int userId) {
        return "Result for user: " + userId;
    }
}