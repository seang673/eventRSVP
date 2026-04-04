package com.example.demo.repository;
import com.example.demo.dto.RsvpResponse;
import com.example.demo.model.Rsvp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
public interface RsvpRepository extends JpaRepository<Rsvp, Long> {
    List<Rsvp> findByUserId(Long userId);
    List<Rsvp> findByEventId(Long eventId);
    void deleteById(Long id);
    int countByEventId(Long eventId);
    List<Rsvp> findByEventIdIn(List<Long> eventIds); 
    void deleteByEventId(Long eventId);

    @Query("""
        SELECT new com.example.demo.dto.RsvpResponse(r, e)
        FROM Rsvp r
        JOIN Event e ON r.eventId = e.id
        WHERE e.organizerId = :organizerId
    """)
    List<RsvpResponse> findRsvpsForOrganizer(Long organizerId);

}

