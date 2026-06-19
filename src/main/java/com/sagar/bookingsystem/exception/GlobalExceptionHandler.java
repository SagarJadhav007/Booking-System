package com.sagar.bookingsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SeatAlreadyReservedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleSeatReserved(
            SeatAlreadyReservedException ex
    ) {
        return ex.getMessage();
    }
}