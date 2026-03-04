package com.example.demo.service;

import com.example.demo.dto.EventResponse;
import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.RsvpRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final RsvpRepository rsvpRepository;

    public EventService(EventRepository eventRepository, RsvpRepository rsvpRepository) {
        this.eventRepository = eventRepository;
        this.rsvpRepository = rsvpRepository;
    }

    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepository.findAll();

        return events.stream()
                .map(event -> new EventResponse(
                        event,
                        rsvpRepository.countByEventId(event.getId())
                ))
                .collect(Collectors.toList());
    }


    public Event getById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

    public Event create(String title, LocalDate date, String location, int capacity, String description, Long organizerId) {
        Event event = new Event();
        event.setTitle(title);
        event.setDate(date);
        event.setLocation(location);
        event.setCapacity(capacity);
        event.setDescription(description);
        event.setOrganizerId(organizerId);

        return eventRepository.save(event);
    }


}

