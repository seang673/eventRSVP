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

    public Long getId() {
        return id;
    }
    public Long getEventId() {
        return eventId;
    }
    public String getEventName() {
        return eventName;
    }
    public String getEventDate() {
        return eventDate;
    }
    public String getEventLocation() {
        return eventLocation;
    }
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public String getMessage() {
        return message;
    }
    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }
    public void setEventLocation(String eventLocation) {
        this.eventLocation = eventLocation;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }
    
}
