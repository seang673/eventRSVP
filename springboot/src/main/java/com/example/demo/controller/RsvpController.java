package com.example.demo.controller;
import com.example.demo.dto.RsvpRequest;
import com.example.demo.model.Rsvp;
import com.example.demo.service.RsvpService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsvp")
public class RsvpController {

    private final RsvpService service;

    public RsvpController(RsvpService service) {
        this.service = service;
    }

    @PostMapping
    public Rsvp create(@Valid @RequestBody RsvpRequest req) {
        return service.create(req.getName(), req.getEmail(), req.getMessage(), req.getEventId());

    }

    @GetMapping
    public List<Rsvp> getAll() {
        return service.getAll();
    }

    @GetMapping("/event/{eventId}")
    public List<Rsvp> getByEvent(@PathVariable Long eventId) {
        return service.getByEvent(eventId);
    }


}



