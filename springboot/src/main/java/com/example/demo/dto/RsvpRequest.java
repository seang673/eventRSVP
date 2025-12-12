package com.example.demo.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RsvpRequest {
    @NotBlank(message = "Title is required")
    private String name;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Event ID is required")
    @Min(value = 1, message = "Event ID must be a positive number")
    private Long eventId;

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getMessage() { return message; }
    public Long getEventId() { return eventId;}

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setMessage(String message) { this.message = message; }
    public void setEventId(Long id) { this.eventId = eventId;}
    
}
