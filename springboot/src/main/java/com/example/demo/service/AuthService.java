package com.example.demo.service;

import com.example.demo.repository.CustomUserRepository;
import com.example.demo.security.DjangoPasswordHasher;

import io.jsonwebtoken.lang.Arrays;

import com.example.demo.dto.RegisterDTO;
import com.example.demo.model.CustomUser;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CustomUserRepository repo;

    public AuthService(CustomUserRepository repo) {
        this.repo = repo;
    }

    public CustomUser authenticate(String username, String password) {

        System.out.println("Request username = [" + username + "]");
        CustomUser user = repo.findByUsername(username.trim())
            .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("DB username = [" + user.getUsername() + "]");

        if (!DjangoPasswordHasher.checkPassword(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public CustomUser register(RegisterDTO dto) {

        if (repo.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        CustomUser user = new CustomUser();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        // Hash password using Django PBKDF2
        String hashed = DjangoPasswordHasher.encode(dto.getPassword());
        user.setPassword(hashed);

        user.setActive(true);
        user.setOrganizer(dto.isOrganizer());
        user.setStaff(false);
        user.setSuperuser(false);
        user.setDateJoined(LocalDateTime.now());

        return repo.save(user);
    }


}

