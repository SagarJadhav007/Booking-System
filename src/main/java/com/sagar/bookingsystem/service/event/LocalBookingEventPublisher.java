package com.sagar.bookingsystem.service.event;

import com.sagar.bookingsystem.dto.sqs.BookingCreatedEvent;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(
        name = "aws.enabled",
        havingValue = "false",
        matchIfMissing = true
)
public class LocalBookingEventPublisher implements BookingEventPublisher {

    @Override
    public void publish(
            BookingCreatedEvent event
    ) {

        System.out.println(
                "LOCAL BOOKING EVENT => "
                        + event.getBookingId()
        );
    }
}