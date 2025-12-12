package com.example.demo.service;
import com.example.demo.model.Rsvp;
import com.example.demo.repository.RsvpRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RsvpService {
    private final RsvpRepository repo;

    public RsvpService(RsvpRepository repo) {
        this.repo = repo;
    }

    public Rsvp create(Rsvp rsvp) {
        return repo.save(rsvp);
    }

    public List<Rsvp> getAll() {
        return repo.findAll();
    }


}
