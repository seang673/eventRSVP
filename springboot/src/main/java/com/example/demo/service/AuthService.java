package com.example.demo.service;

import com.example.demo.repository.CustomUserRepository;
import com.example.demo.security.DjangoPasswordHasher;
import com.example.demo.model.CustomUser;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CustomUserRepository repo;

    public AuthService(CustomUserRepository repo) {
        this.repo = repo;
    }

    public CustomUser authenticate(String username, String password) {
        CustomUser user = repo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!DjangoPasswordHasher.checkPassword(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}

