package com.example.demo.controller;
import com.example.demo.dto.EventRequest;
import com.example.demo.dto.RsvpRequest;
import com.example.demo.model.Rsvp;
import com.example.demo.service.RsvpService;

import jakarta.servlet.http.HttpServletRequest;
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
    public Rsvp create(HttpServletRequest request, @Valid @RequestBody RsvpRequest req) {

        // Any authenticated user may RSVP — no organizer check
        Long userId = (Long) request.getAttribute("userId");

        return service.create(
                req.getName(),
                req.getEmail(),
                req.getMessage(),
                req.getEventId()
        );
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



