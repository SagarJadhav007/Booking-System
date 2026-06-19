package com.sagar.bookingsystem.repository;

import com.sagar.bookingsystem.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository
        extends JpaRepository<Event, String> {
}