package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.RsvpResponse;
import com.example.demo.model.Event;
import com.example.demo.model.Rsvp;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.RsvpRepository;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final EventRepository eventRepository;
    private final RsvpRepository rsvpRepository;

    public ProfileController(EventRepository eventRepository, RsvpRepository rsvpRepository) {
        this.eventRepository = eventRepository;
        this.rsvpRepository = rsvpRepository;
    }

    @GetMapping("/organizer")
    public ResponseEntity<?> getOrganizerProfile(HttpServletRequest request) {

        Boolean isOrganizer = (Boolean) request.getAttribute("isOrganizer");
        Long userId = (Long) request.getAttribute("userId");

        if (!isOrganizer) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only organizers can access this endpoint");
        }

        // 1. Fetch all events created by this organizer
        List<Event> events = eventRepository.findByOrganizerId(userId);

        // 2. Fetch all RSVPs for those events
        List<Long> eventIds = events.stream()
                .map(Event::getId)
                .toList();

        List<Rsvp> rsvps = rsvpRepository.findByEventIdIn(eventIds);

        Map<String, Object> response = new HashMap<>();
        response.put("events", events);
        response.put("rsvps", rsvps);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/attendee")
    public ResponseEntity<?> getAttendeeProfile(HttpServletRequest request) {
        System.out.println("ATTENDEE PROFILE HIT");
        Boolean isOrganizer = (Boolean) request.getAttribute("isOrganizer");
        Long userId = (Long) request.getAttribute("userId");

        // Attendees only — organizers shouldn't hit this
        if (isOrganizer) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("This profile is for attendees");
        }

        List<Rsvp> rsvps = rsvpRepository.findByUserId(userId);

        List<RsvpResponse> response = rsvps.stream()
            .map(rsvp -> {
                Event event = eventRepository.findById(rsvp.getEventId())
                        .orElseThrow(() -> new RuntimeException("Event not found"));
                return new RsvpResponse(rsvp, event);
            })
            .toList();
        return ResponseEntity.ok(rsvps);
    }
}