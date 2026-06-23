package com.sagar.bookingsystem.repository;

import com.sagar.bookingsystem.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface SeatRepository
        extends JpaRepository<Seat, String> {

    Optional<Seat> findBySeatId(String seatId);

    List<Seat> findByEventId(String eventId);
}