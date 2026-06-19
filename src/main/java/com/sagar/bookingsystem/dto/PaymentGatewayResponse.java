package com.sagar.bookingsystem.dto;

public record PaymentGatewayResponse(

        boolean success,

        String transactionId,

        String message

) {
}