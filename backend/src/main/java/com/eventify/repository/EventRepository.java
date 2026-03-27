package com.eventify.repository;

import com.eventify.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(String category);
    List<Event> findByLocation(String location);
    List<Event> findByCategoryAndLocation(String category, String location);
}
