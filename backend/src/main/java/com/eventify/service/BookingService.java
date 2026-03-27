package com.eventify.service;

import com.eventify.entity.Booking;
import com.eventify.entity.Event;
import com.eventify.repository.BookingRepository;
import com.eventify.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventService eventService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByEvent(Long eventId) {
        return bookingRepository.findByEventId(eventId);
    }

    public Booking createBooking(Booking booking) {
        Optional<Event> eventOpt = eventRepository.findById(booking.getEventId());
        if (eventOpt.isEmpty()) {
            throw new RuntimeException("Event not found");
        }
        Event event = eventOpt.get();
        if (event.getAvailableSeats() < booking.getSeats()) {
            throw new RuntimeException("Not enough seats available");
        }
        double total = event.getPrice() * booking.getSeats();
        booking.setTotalAmount(total);
        booking.setStatus("CONFIRMED");
        boolean reduced = eventService.reduceSeats(booking.getEventId(), booking.getSeats());
        if (!reduced) {
            throw new RuntimeException("Could not reduce seats");
        }
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
