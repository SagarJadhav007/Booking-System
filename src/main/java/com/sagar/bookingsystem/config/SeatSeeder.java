package com.sagar.bookingsystem.config;

import com.sagar.bookingsystem.model.Seat;
import com.sagar.bookingsystem.model.SeatStatus;
import com.sagar.bookingsystem.repository.SeatRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeatSeeder {

    private final SeatRepository seatRepository;

    @PostConstruct
    public void seed() {

        if (seatRepository.count() > 0) {
            System.out.println("Seats already seeded");
            return;
        }

        for (int i = 1; i <= 25; i++) {

            seatRepository.save(
                    Seat.builder()
                            .seatId("A" + i)
                            .eventId("EVENT_1")
                            .status(SeatStatus.AVAILABLE)
                            .build()
            );
        }

        for (int i = 1; i <= 25; i++) {

            seatRepository.save(
                    Seat.builder()
                            .seatId("B" + i)
                            .eventId("EVENT_1")
                            .status(SeatStatus.AVAILABLE)
                            .build()
            );
        }

        System.out.println("50 seats seeded");
    }
}