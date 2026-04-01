package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.model.Event;
import com.example.demo.model.Rsvp;

public class RsvpResponse {
    private Long id;
    private Long eventId;
    private String eventName;
    private String eventDate;
    private String eventLocation;
    private String name;
    private String email;
    private String message;
    private LocalDateTime timeStamp;

    public RsvpResponse(Rsvp rsvp, Event event) {
        this.id = rsvp.getId();
        this.eventId = rsvp.getEventId();
        this.eventName = event.getTitle();
        this.eventDate = event.getDate().toString();
        this.eventLocation = event.getLocation();
        this.name = rsvp.getName();
        this.email = rsvp.getEmail();
        this.message = rsvp.getMessage();
        this.timeStamp = rsvp.getTimeStamp();
    }
}
