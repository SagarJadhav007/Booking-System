package com.sagar.bookingsystem.dto;

public record ConfirmPaymentRequest(

        String seatId,

        String userId,

        String paymentId,

        String idempotencyKey

) {
}