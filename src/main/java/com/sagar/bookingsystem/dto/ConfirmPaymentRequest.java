package com.sagar.bookingsystem.dto;

public record ConfirmPaymentRequest(

        String seatId,

        String paymentId,

        String idempotencyKey

) {
}