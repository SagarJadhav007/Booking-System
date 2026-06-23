package com.sagar.bookingsystem.service.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sagar.bookingsystem.dto.sqs.BookingCreatedEvent;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

@Service
@RequiredArgsConstructor
@Primary
@ConditionalOnProperty(
        name = "aws.sqs.booking-queue-url"
)
public class SqsBookingEventPublisher
        implements BookingEventPublisher {

    private final SqsClient sqsClient;

    private final ObjectMapper objectMapper;

    @Value("${aws.sqs.booking-queue-url}")
    private String queueUrl;

    @Override
    public void publish(
            BookingCreatedEvent event
    ) {

        try {

            String payload =
                    objectMapper
                            .writeValueAsString(
                                    event
                            );

            sqsClient.sendMessage(

                    SendMessageRequest
                            .builder()

                            .queueUrl(
                                    queueUrl
                            )

                            .messageBody(
                                    payload
                            )

                            .build()
            );

            System.out.println(
                    "SQS EVENT SENT => "
                            + event.getBookingId()
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to publish SQS message",
                    e
            );
        }
    }
}