package com.example.demo.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name="rsvp")
public class Rsvp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String message; // attendee message
    private Long userId;

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;


    public Rsvp() {}

    public Rsvp(String name, String email, String status, String message, long eventId, LocalDateTime timestamp) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.eventId = eventId;
        this.timestamp = timestamp;
    }

    // getters and setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getMessage() { return message; }
    public Long getEventId() { return eventId; }
    public Long getUserId() { return userId; }
    public LocalDateTime getTimeStamp() { return timestamp; }


    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setMessage(String message) { this.message = message; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }




}
