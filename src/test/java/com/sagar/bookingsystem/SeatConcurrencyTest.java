package com.sagar.bookingsystem;

import com.sagar.bookingsystem.dto.ReserveSeatRequest;
import com.sagar.bookingsystem.model.Seat;
import com.sagar.bookingsystem.model.SeatStatus;
import com.sagar.bookingsystem.repository.SeatRepository;
import com.sagar.bookingsystem.service.RedisSeatHoldService;
import com.sagar.bookingsystem.service.SeatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SeatConcurrencyTest {

    @Autowired
    private SeatService seatService;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private RedisSeatHoldService redisSeatHoldService;

    @BeforeEach
    void setup() {

        Seat seat = seatRepository
                .findBySeatId("A1")
                .orElseThrow();

        seat.setStatus(
                SeatStatus.AVAILABLE
        );

        seatRepository.save(seat);

        redisSeatHoldService.releaseSeat(
                "A1"
        );
    }

    @Test
    void shouldAllowOnlyOneRedisSeatHold()
            throws Exception {

        int threadCount = 100;

        AtomicInteger successCount =
                new AtomicInteger();

        AtomicInteger failureCount =
                new AtomicInteger();

        ExecutorService executor =
                Executors.newVirtualThreadPerTaskExecutor();

        CountDownLatch readyLatch =
                new CountDownLatch(threadCount);

        CountDownLatch startLatch =
                new CountDownLatch(1);

        CountDownLatch finishLatch =
                new CountDownLatch(threadCount);

        for (int i = 0; i < threadCount; i++) {

            int userNumber = i;

            executor.submit(() -> {

                try {

                    readyLatch.countDown();

                    startLatch.await();

                    seatService.reserveSeat(

                            new ReserveSeatRequest(
                                    "A1",
                                    "user-" + userNumber
                            )
                    );

                    successCount.incrementAndGet();

                    System.out.println(
                            "SUCCESS -> user-"
                                    + userNumber
                    );

                } catch (Exception e) {

                    failureCount.incrementAndGet();

                    System.out.println(
                            "FAILED -> user-"
                                    + userNumber
                                    + " | "
                                    + e.getClass()
                                    .getSimpleName()
                    );

                } finally {

                    finishLatch.countDown();
                }
            });
        }

        readyLatch.await();

        long startTime =
                System.currentTimeMillis();

        startLatch.countDown();

        finishLatch.await();

        long endTime =
                System.currentTimeMillis();

        executor.shutdown();

        System.out.println(
                "\n========== RESULTS =========="
        );

        System.out.println(
                "Success Count = "
                        + successCount.get()
        );

        System.out.println(
                "Failure Count = "
                        + failureCount.get()
        );

        System.out.println(
                "Execution Time = "
                        + (endTime - startTime)
                        + " ms"
        );

        System.out.println(
                "=============================\n"
        );

        assertEquals(
                1,
                successCount.get()
        );

        assertEquals(
                99,
                failureCount.get()
        );
    }
}