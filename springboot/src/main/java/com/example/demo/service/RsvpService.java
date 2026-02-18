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

    public Rsvp create(String name, String email, String message, Long userId, Long eventId) {
        Rsvp r = new Rsvp();
        r.setName(name);
        r.setEmail(email);
        r.setMessage(message);
        r.setEventId(eventId);
        r.setUserId(userId);
        r.setTimestamp(LocalDateTime.now());
        return repo.save(r);

    }

     public Rsvp getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public void deleteByEventId(Long eventId) {   //Deleting all RSVPS for an event when the event is deleted
        repo.deleteByEventId(eventId);
    }





    public List<Rsvp> getAll() {
        return repo.findAll();
    }

    public List<Rsvp> getByEvent(Long eventId) {
        return repo.findByEventId(eventId);
    }


}
