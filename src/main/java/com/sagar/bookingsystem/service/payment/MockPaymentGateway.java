package com.sagar.bookingsystem.service.payment;

import com.sagar.bookingsystem.dto.PaymentGatewayResponse;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MockPaymentGateway
        implements PaymentGateway {

    @Override
    public PaymentGatewayResponse processPayment(
            String paymentId,
            Double amount
    ) {

        System.out.println(
                "Processing payment: "
                        + paymentId
        );

        return new PaymentGatewayResponse(
                true,
                UUID.randomUUID().toString(),
                "Payment Successful"
        );
    }
}