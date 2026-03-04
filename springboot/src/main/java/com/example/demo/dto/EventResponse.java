package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.model.Event;

public class EventResponse {
    private Long id;
    private String title;
    private LocalDate date;
    private String location;
    private int capacity;
    private String description;
    private Long organizerId;
    private int rsvpCount;

    // Constructors
    public EventResponse() {
    }

    public EventResponse(Long id, String title, LocalDate date, String location, int capacity, String description, Long organizerId, int rsvpCount) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.location = location;
        this.capacity = capacity;
        this.description = description;
        this.organizerId = organizerId;
        this.rsvpCount = rsvpCount;
    }

    public EventResponse(Event event, int rsvpCount) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.date = event.getDate();
        this.location = event.getLocation();
        this.capacity = event.getCapacity();
        this.description = event.getDescription();
        this.organizerId = event.getOrganizerId();
        this.rsvpCount = rsvpCount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getRsvpCount() {
        return rsvpCount;
    }
    public void setRsvpCount(int rsvpCount) {
        this.rsvpCount = rsvpCount;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }
    
}
