package com.sagar.bookingsystem.service;

import com.sagar.bookingsystem.dto.ConfirmPaymentRequest;
import com.sagar.bookingsystem.dto.PaymentGatewayResponse;
import com.sagar.bookingsystem.dto.SeatHold;
import com.sagar.bookingsystem.dto.StartPaymentRequest;
import com.sagar.bookingsystem.model.Booking;
import com.sagar.bookingsystem.model.PaymentTransaction;
import com.sagar.bookingsystem.model.Seat;
import com.sagar.bookingsystem.model.SeatStatus;
import com.sagar.bookingsystem.repository.BookingRepository;
import com.sagar.bookingsystem.repository.PaymentTransactionRepository;
import com.sagar.bookingsystem.repository.SeatRepository;
import com.sagar.bookingsystem.service.payment.PaymentGateway;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final SeatRepository seatRepository;

    private final BookingRepository bookingRepository;

    private final PaymentTransactionRepository
            paymentTransactionRepository;

    private final PaymentGateway paymentGateway;

    private final RedisSeatHoldService
            redisSeatHoldService;

    public void startPayment(
            StartPaymentRequest request
    ) {

        SeatHold hold =
                redisSeatHoldService.getHold(
                        request.seatId()
                );

        if (hold == null) {

            throw new RuntimeException(
                    "Seat hold expired"
            );
        }

        if (!hold.getUserId().equals(
                request.userId()
        )) {

            throw new RuntimeException(
                    "Seat belongs to another user"
            );
        }

        redisSeatHoldService.updateState(
                request.seatId(),
                "PAYMENT_PENDING"
        );

        System.out.println(
                "Payment started for seat "
                        + request.seatId()
        );
    }

    public void confirmPayment(
            ConfirmPaymentRequest request
    ) {

        if (paymentTransactionRepository.existsById(
                request.idempotencyKey()
        )) {

            System.out.println(
                    "Duplicate payment request ignored"
            );

            return;
        }

        SeatHold hold =
                redisSeatHoldService.getHold(
                        request.seatId()
                );

        if (hold == null) {

            throw new RuntimeException(
                    "Seat hold expired"
            );
        }

        if (!hold.getUserId().equals(
                request.userId()
        )) {

            throw new RuntimeException(
                    "Seat belongs to another user"
            );
        }

        if (!"PAYMENT_PENDING".equals(
                hold.getState()
        )) {

            throw new RuntimeException(
                    "Payment not started"
            );
        }

        PaymentGatewayResponse gatewayResponse =
                paymentGateway.processPayment(
                        request.paymentId(),
                        500.0
                );

        if (!gatewayResponse.success()) {

            paymentTransactionRepository.save(

                    PaymentTransaction.builder()
                            .idempotencyKey(
                                    request.idempotencyKey()
                            )
                            .paymentId(
                                    request.paymentId()
                            )
                            .seatId(
                                    request.seatId()
                            )
                            .amount(500.0)
                            .createdAt(
                                    Instant.now()
                            )
                            .status("FAILED")
                            .build()
            );

            throw new RuntimeException(
                    "Payment Failed"
            );
        }

        Booking booking =

                Booking.builder()
                        .bookingId(
                                UUID.randomUUID()
                                        .toString()
                        )
                        .seatId(
                                request.seatId()
                        )
                        .userId(
                                request.userId()
                        )
                        .paymentId(
                                request.paymentId()
                        )
                        .bookedAt(
                                Instant.now()
                        )
                        .build();

        bookingRepository.save(
                booking
        );

        Seat seat =
                seatRepository.findBySeatId(
                        request.seatId()
                ).orElseThrow();

        seat.setStatus(
                SeatStatus.CONFIRMED
        );

        seatRepository.save(
                seat
        );

        paymentTransactionRepository.save(

                PaymentTransaction.builder()
                        .idempotencyKey(
                                request.idempotencyKey()
                        )
                        .paymentId(
                                request.paymentId()
                        )
                        .seatId(
                                request.seatId()
                        )
                        .amount(500.0)
                        .createdAt(
                                Instant.now()
                        )
                        .status("SUCCESS")
                        .build()
        );

        redisSeatHoldService.releaseSeat(
                request.seatId()
        );

        System.out.println(
                "PAYMENT SUCCESS: "
                        + request.paymentId()
        );

        System.out.println(
                "Gateway Transaction Id: "
                        + gatewayResponse.transactionId()
        );
    }
}