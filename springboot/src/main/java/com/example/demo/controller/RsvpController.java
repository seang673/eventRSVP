package com.example.demo.controller;
import com.example.demo.dto.EventRequest;
import com.example.demo.dto.RsvpRequest;
import com.example.demo.model.Event;
import com.example.demo.model.Rsvp;
import com.example.demo.service.EventService;
import com.example.demo.service.RsvpService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsvp")
public class RsvpController {

    private final RsvpService rsvpService;
    private final EventService eventService;

    public RsvpController(RsvpService rsvpService, EventService eventService) {
        this.rsvpService = rsvpService;
        this.eventService = eventService;
    }

    @PostMapping
    public Rsvp create(HttpServletRequest request, @Valid @RequestBody RsvpRequest req) {
        System.out.println("RSVP CONTROLLER HIT");

        return rsvpService.create(
                req.getName(),
                req.getEmail(),
                req.getMessage(),
                req.getEventId()
        );
    }


    @GetMapping
    public List<Rsvp> getAll() {
        return rsvpService.getAll();
    }

    @GetMapping("/event/{eventId}")
    public List<Rsvp> getByEvent(@PathVariable Long eventId) {
        return rsvpService.getByEvent(eventId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRsvp( @PathVariable Long id, HttpServletRequest request)
    {
        Long userId = (Long) request.getAttribute("userId");
        Boolean isOrganizer = (Boolean) request.getAttribute("isOrganizer");

        Rsvp rsvp = rsvpService.getById(id);
        if (rsvp == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("RSVP not found");
        }

        // Attendee deleting another attendee's own RSVP
        if (!isOrganizer && !rsvp.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can only delete your own RSVPs!");
        }

        // Organizer deleting RSVP to their event
        if (isOrganizer) {
            Event event = eventService.getById(rsvp.getEventId());
            if (!event.getOrganizerId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only delete RSVPs for your own events");
            }
        }

        rsvpService.delete(id);
        return ResponseEntity.noContent().build();
    }


}



