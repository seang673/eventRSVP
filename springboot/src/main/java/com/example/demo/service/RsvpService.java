package com.example.demo.service;
import com.example.demo.model.Rsvp;
import com.example.demo.repository.RsvpRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;

@Service
public class RsvpService {
    private final RsvpRepository repo;

    public RsvpService(RsvpRepository repo) {
        this.repo = repo;
    }

    public Rsvp create(String name, String email, String message, Long eventId) {
        Rsvp r = new Rsvp();
        r.setName(name);
        r.setEmail(email);
        r.setMessage(message);
        r.setEventId(eventId);
        r.setTimestamp(LocalDateTime.now());
        return repo.save(r);

    }

    public List<Rsvp> getAll() {
        return repo.findAll();
    }

    public List<Rsvp> getByEvent(Long eventId) {
        return repo.findByEventId(eventId);
    }


}
