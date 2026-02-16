package com.example.demo.repository;
import com.example.demo.model.Rsvp;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
public interface RsvpRepository extends JpaRepository<Rsvp, Long> {
    List<Rsvp> findByUserId(Long userId);
    List<Rsvp> findByEventId(Long eventId);
    void deleteById(Long id);
    void deleteByEventId(Long eventId);


}

