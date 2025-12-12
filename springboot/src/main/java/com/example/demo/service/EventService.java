package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repo;

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public List<Event> getAll() {
        return repo.findAll();
    }

    public Event getById(Long id) {
        return repo.findById(id).orElse(null);
    }
}

