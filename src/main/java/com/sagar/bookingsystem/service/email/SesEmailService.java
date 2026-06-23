package com.sagar.bookingsystem.service.email;

import com.sagar.bookingsystem.dto.sqs.BookingCreatedEvent;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.ses.SesClient;

import software.amazon.awssdk.services.ses.model.*;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "aws.ses.sender-email"
)
public class SesEmailService
        implements EmailService {

    private final SesClient sesClient;

    @Value("${aws.ses.sender-email}")
    private String senderEmail;

    @Override
    public void sendBookingConfirmation(
            BookingCreatedEvent event
    ) {

        String subject =
                "Booking Confirmation";

        String body = """

                Your booking is confirmed.

                Booking Id: %s

                Event Id: %s

                Seat: %s

                Amount: ₹%.2f

                """
                .formatted(

                        event.getBookingId(),

                        event.getEventId(),

                        event.getSeatId(),

                        event.getAmount()
                );

        SendEmailRequest request =

                SendEmailRequest.builder()

                        .source(
                                senderEmail
                        )

                        .destination(

                                Destination.builder()

                                        .toAddresses(
                                                event.getUserEmail()
                                        )

                                        .build()
                        )

                        .message(

                                Message.builder()

                                        .subject(

                                                Content.builder()

                                                        .data(
                                                                subject
                                                        )

                                                        .build()
                                        )

                                        .body(

                                                Body.builder()

                                                        .text(

                                                                Content.builder()

                                                                        .data(
                                                                                body
                                                                        )

                                                                        .build()
                                                        )

                                                        .build()
                                        )

                                        .build()
                        )

                        .build();

        sesClient.sendEmail(
                request
        );

        System.out.println(
                "SES EMAIL SENT => "
                        + event.getUserEmail()
        );
    }
}