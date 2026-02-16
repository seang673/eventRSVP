package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.model.CustomUser;
import com.example.demo.repository.CustomUserRepository;

@Service
public class UserService {

    private final CustomUserRepository userRepository;

    public UserService(CustomUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public CustomUser getById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public CustomUser getByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}

