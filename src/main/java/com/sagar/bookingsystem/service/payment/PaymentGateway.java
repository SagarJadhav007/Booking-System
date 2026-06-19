package com.sagar.bookingsystem.service.payment;

import com.sagar.bookingsystem.dto.PaymentGatewayResponse;

public interface PaymentGateway {

    PaymentGatewayResponse processPayment(
            String paymentId,
            Double amount
    );
}