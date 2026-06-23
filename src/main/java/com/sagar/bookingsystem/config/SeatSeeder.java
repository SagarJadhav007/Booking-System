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

            System.out.println(
                    "Seats already seeded"
            );

            return;
        }

        seedRow("A", 10, 220.0);
        seedRow("B", 10, 250.0);

        seedRow("C", 10, 250.0);
        seedRow("D", 10, 300.0);

        seedRow("E", 10, 500.0);
        seedRow("F", 10, 300.0);

        System.out.println(
                "60 seats seeded"
        );
    }

    private void seedRow(
            String row,
            int seats,
            Double price
    ) {

        for (int i = 1; i <= seats; i++) {

            seatRepository.save(

                    Seat.builder()

                            .seatId(
                                    row + i
                            )

                            .seatNumber(
                                    row + i
                            )

                            .rowNumber(
                                    row
                            )

                            .price(
                                    price
                            )

                            .eventId(
                                    "EVENT_1"
                            )

                            .status(
                                    SeatStatus.AVAILABLE
                            )

                            .build()
            );
        }
    }
}