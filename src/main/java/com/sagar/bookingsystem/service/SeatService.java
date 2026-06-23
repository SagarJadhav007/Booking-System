package com.sagar.bookingsystem.service;

import com.sagar.bookingsystem.dto.ReserveSeatRequest;
import com.sagar.bookingsystem.exception.SeatAlreadyReservedException;
import com.sagar.bookingsystem.model.Seat;
import com.sagar.bookingsystem.model.SeatStatus;
import com.sagar.bookingsystem.repository.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.sagar.bookingsystem.util.SecurityUtils;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final RedisSeatHoldService redisSeatHoldService;

    @Transactional
    public void reserveSeat(
            ReserveSeatRequest request
    ) {

        Seat seat = seatRepository
                .findBySeatId(
                        request.getSeatId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Seat not found"
                        )
                );

        if (seat.getStatus()
                != SeatStatus.AVAILABLE) {

            throw new SeatAlreadyReservedException(
                    "Seat already reserved"
            );
        }

        String email =
                SecurityUtils.getCurrentUserEmail();

        boolean acquired =
                redisSeatHoldService.tryCreateHold(
                        request.getSeatId(),
                        email
                );

        if (!acquired) {

            throw new SeatAlreadyReservedException(
                    "Seat already held"
            );
        }

        System.out.println(
                "Redis hold created for "
                        + request.getSeatId()
        );
    }

    @Transactional
    public void resetSeat(
            String seatId
    ) {

        Seat seat = seatRepository
                .findBySeatId(
                        seatId
                )
                .orElseThrow();

        seat.setStatus(
                SeatStatus.AVAILABLE
        );

        seatRepository.save(
                seat
        );

        redisSeatHoldService.releaseSeat(
                seatId
        );
    }
}