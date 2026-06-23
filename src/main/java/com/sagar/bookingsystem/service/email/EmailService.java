package com.sagar.bookingsystem.service.email;

import com.sagar.bookingsystem.dto.sqs.BookingCreatedEvent;

public interface EmailService {

    void sendBookingConfirmation(
            BookingCreatedEvent event
    );
}