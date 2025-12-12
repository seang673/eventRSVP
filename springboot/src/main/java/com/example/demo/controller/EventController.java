package com.example.demo.controller;

import com.example.demo.dto.EventRequest;
import com.example.demo.model.Event;
import com.example.demo.model.Rsvp;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.EventService;
import com.example.demo.service.RsvpService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final RsvpService rsvpService;


    public EventController(EventService service, RsvpService rsvpService) {
        this.eventService = service;
        this.rsvpService = rsvpService; /*So event controller can fetch RSVPS */
    }

    @GetMapping
    public List<Event> getAll() {
        return eventService.getAll();
    }

    /*Retrieve event by its id */
    @GetMapping("/{id}")
    public Event getById(@PathVariable Long id) {
        return eventService.getById(id);
    }

    /*Retrieve the event's rsvps */
    @GetMapping("/{id}/rsvps")
    public List<Rsvp> getRsvpsForEvent(@PathVariable Long id) {
        return rsvpService.getByEvent(id);
    }

    @PostMapping
    public Event create(HttpServletRequest request, @RequestBody EventRequest req) {

        Long organizerId = (Long) request.getAttribute("userId");
        boolean isOrganizer = (boolean) request.getAttribute("isOrganizer");


        if (!isOrganizer) {
            throw new RuntimeException("Only organizers can create events");
        }

        return eventService.create(
                req.getTitle(),
                req.getDate(),
                req.getLocation(),
                req.getCapacity(),
                req.getDescription(),
                organizerId
        );
    }



}

