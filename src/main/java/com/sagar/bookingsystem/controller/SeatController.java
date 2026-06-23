package com.sagar.bookingsystem.controller;

import com.sagar.bookingsystem.dto.ReserveSeatRequest;
import com.sagar.bookingsystem.dto.SeatResponse;
import com.sagar.bookingsystem.model.Seat;
import com.sagar.bookingsystem.dto.SeatHold;
import com.sagar.bookingsystem.repository.SeatRepository;
import com.sagar.bookingsystem.service.RedisSeatHoldService;
import com.sagar.bookingsystem.service.SeatService;
import com.sagar.bookingsystem.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatRepository seatRepository;
    private final SeatService seatService;
    private final RedisSeatHoldService redisSeatHoldService;

    @PostMapping("/reserve")
    public String reserveSeat(
            @RequestBody ReserveSeatRequest request
    ) {

        seatService.reserveSeat(request);

        return "Seat Reserved";
    }

    @PostMapping("/reset/{seatId}")
    public String resetSeat(
            @PathVariable String seatId
    ) {

        seatService.resetSeat(seatId);

        return "Reset";
    }

    @GetMapping("/redis/{seatId}")
    public SeatHold getRedisSeat(
            @PathVariable String seatId
    ) {

        return redisSeatHoldService
                .getHold(seatId);
    }
}