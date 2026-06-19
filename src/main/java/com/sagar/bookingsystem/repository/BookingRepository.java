package com.sagar.bookingsystem.repository;

import com.sagar.bookingsystem.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository
        extends JpaRepository<Booking, String> {
}