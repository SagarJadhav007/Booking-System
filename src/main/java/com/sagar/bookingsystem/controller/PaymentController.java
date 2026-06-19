package com.sagar.bookingsystem.controller;

import com.sagar.bookingsystem.dto.ConfirmPaymentRequest;
import com.sagar.bookingsystem.dto.StartPaymentRequest;
import com.sagar.bookingsystem.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/start")
    public ResponseEntity<String> startPayment(
            @RequestBody StartPaymentRequest request
    ) {

        paymentService.startPayment(request);

        return ResponseEntity.ok("Payment started");
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPayment(
            @RequestBody ConfirmPaymentRequest request
    ) {

        paymentService.confirmPayment(request);

        return ResponseEntity.ok("Booking confirmed");
    }
}