package com.example.demo.controller;

import com.example.demo.dto.EventRequest;
import com.example.demo.model.Event;
import com.example.demo.model.Rsvp;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.EventService;
import com.example.demo.service.RsvpService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

        Boolean isOrganizer = (Boolean) request.getAttribute("isOrganizer");
        Long organizerId = (Long) request.getAttribute("userId");

        if (isOrganizer == null || !isOrganizer) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, HttpServletRequest request)
    {
        Long userId = (Long) request.getAttribute("userId");
        Boolean isOrganizer = (Boolean) request.getAttribute("isOrganizer");

        // Only organizers can delete events
        if (!isOrganizer) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only organizers can delete events");
        }

        Event event = eventService.getById(id);
        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Event not found");
        }

        // Organizer can only delete their own events
        if (!event.getOrganizerId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only delete your own events");
        }

        // Delete RSVPs first (if cascade is not enabled)
        rsvpService.deleteByEventId(id);

        // Delete the event
        eventService.delete(id);

        return ResponseEntity.noContent().build();
    }




}

