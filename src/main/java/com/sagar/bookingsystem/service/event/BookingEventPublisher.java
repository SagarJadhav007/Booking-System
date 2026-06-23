package com.sagar.bookingsystem.service.event;

import com.sagar.bookingsystem.dto.sqs.BookingCreatedEvent;

public interface BookingEventPublisher {

    void publish(
            BookingCreatedEvent event
    );
}