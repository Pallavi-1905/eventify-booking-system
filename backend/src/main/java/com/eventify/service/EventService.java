package com.eventify.service;

import com.eventify.entity.Event;
import com.eventify.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

    public List<Event> getEventsByLocation(String location) {
        return eventRepository.findByLocation(location);
    }

    public Event saveEvent(Event event) {
        if (event.getAvailableSeats() == 0 && event.getTotalSeats() > 0) {
            event.setAvailableSeats(event.getTotalSeats());
        }
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(existing -> {
            existing.setName(updatedEvent.getName());
            existing.setCategory(updatedEvent.getCategory());
            existing.setLocation(updatedEvent.getLocation());
            existing.setEventDate(updatedEvent.getEventDate());
            existing.setPrice(updatedEvent.getPrice());
            existing.setTotalSeats(updatedEvent.getTotalSeats());
            existing.setAvailableSeats(updatedEvent.getAvailableSeats());
            existing.setImage(updatedEvent.getImage());
            existing.setDescription(updatedEvent.getDescription());
            return eventRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Event not found: " + id));
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public boolean reduceSeats(Long eventId, int seats) {
        Optional<Event> opt = eventRepository.findById(eventId);
        if (opt.isPresent()) {
            Event event = opt.get();
            if (event.getAvailableSeats() >= seats) {
                event.setAvailableSeats(event.getAvailableSeats() - seats);
                eventRepository.save(event);
                return true;
            }
        }
        return false;
    }
}
