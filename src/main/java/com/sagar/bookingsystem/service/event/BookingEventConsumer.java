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

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "aws.sqs.booking-queue-url"
)
public class BookingEventConsumer {

    private final SqsClient sqsClient;

    private final ObjectMapper objectMapper;

    private final EmailService emailService;

    @Value("${aws.sqs.booking-queue-url}")
    private String queueUrl;

    @Scheduled(
            fixedDelay = 5000
    )
    public void pollMessages() {

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

            ReceiveMessageResponse response =
                    sqsClient.receiveMessage(
                            request
                    );

            for (Message message :
                    response.messages()) {

                BookingCreatedEvent event =

                        objectMapper.readValue(

                                message.body(),

                                BookingCreatedEvent.class
                        );

                processEvent(
                        event
                );

                sqsClient.deleteMessage(

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

            e.printStackTrace();
        }
    }

    private void processEvent(
            BookingCreatedEvent event
    ) {

        System.out.println(
                "BOOKING CONSUMED => "
                        + event.getBookingId()
        );

        emailService.sendBookingConfirmation(
                event
        );
    }
}