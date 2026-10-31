package com.sagar.bookingsystem.service.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sagar.bookingsystem.dto.sqs.BookingCreatedEvent;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.*;
import com.sagar.bookingsystem.service.email.EmailService;

import java.util.List;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "aws.sqs.booking-queue-url"
)
public class BookingEventConsumer {

    private final SqsClient sqsClient;

    private final ObjectMapper objectMapper;

    private final EmailService emailService;

    @Value("${aws.sqs.booking-queue-url:}")
    private String queueUrl;

    @Scheduled(
            fixedDelay = 5000
    )
    public void pollMessages() {

        if (queueUrl == null || queueUrl.isBlank()) {
            return;
        }

        try {

            ReceiveMessageRequest request =

                    ReceiveMessageRequest
                            .builder()

                            .queueUrl(
                                    queueUrl
                            )

                            .maxNumberOfMessages(
                                    10
                            )

                            .waitTimeSeconds(
                                    5
                            )

                            .build();

            List<Message> messages =
                    sqsClient
                            .receiveMessage(
                                    request
                            )
                            .messages();

            for (
                    Message message :
                    messages
            ) {

                BookingCreatedEvent event =
                        objectMapper
                                .readValue(
                                        message.body(),
                                        BookingCreatedEvent.class
                                );

                emailService
                        .sendBookingConfirmation(
                                event
                        );

                sqsClient
                        .deleteMessage(

                                DeleteMessageRequest
                                        .builder()

                                        .queueUrl(
                                                queueUrl
                                        )

                                        .receiptHandle(
                                                message.receiptHandle()
                                        )

                                        .build()
                        );
            }

        } catch (Exception e) {

            System.out.println(
                    "Error processing message: "
                            + e.getMessage()
            );
        }
    }
}
