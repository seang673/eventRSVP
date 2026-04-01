package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.CustomUser;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;

    public DashboardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getDashboard(HttpServletRequest request) {
        System.out.println("DASHBOARD CONTROLLER HIT");
        Long userId = (Long) request.getAttribute("userId");
        Boolean isOrganizer = (Boolean) request.getAttribute("isOrganizer");

        CustomUser user = userService.getById(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("isOrganizer", isOrganizer);

        return ResponseEntity.ok(response);
    }
}