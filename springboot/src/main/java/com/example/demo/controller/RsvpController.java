package com.example.demo.controller;
import com.example.demo.model.Rsvp;
import com.example.demo.service.RsvpService;
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
    public Rsvp create(@RequestBody Rsvp rsvp) {
        return service.create(rsvp);
    }

    @GetMapping
    public List<Rsvp> getAll() {
        return service.getAll();
    }
}



