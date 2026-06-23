package com.sagar.bookingsystem.service.email;

import com.sagar.bookingsystem.dto.sqs.BookingCreatedEvent;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnMissingBean(
        EmailService.class
)
public class LocalEmailService
        implements EmailService {

    @Override
    public void sendBookingConfirmation(
            BookingCreatedEvent event
    ) {

        System.out.println(
                "LOCAL EMAIL => "
                        + event.getUserEmail()
        );
    }
}