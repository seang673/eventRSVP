package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RegisterDTO;
import com.example.demo.model.CustomUser;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
        authService.register(dto);
        return ResponseEntity.ok("User registered successfully");
    }


    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req) {
        CustomUser user = authService.authenticate(req.getUsername(), req.getPassword());

        String token = JwtUtil.generateToken(user.getId(), user.isOrganizer());

        return Map.of("token", token);
    }

}

