package com.example.demo.controller;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/api/test")
    public String hello() {
        return "Spring Boot is running!";
    }


    @GetMapping("/api/rsvp/sample")
    public Map<String, String> sample() {
        return Map.of("status", "success", "message", "RSVP endpoint working");
    }
}

