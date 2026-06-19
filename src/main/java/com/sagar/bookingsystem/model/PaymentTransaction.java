package com.sagar.bookingsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransaction {

    @Id
    private String idempotencyKey;

    private String paymentId;

    private String seatId;

    private String status;

    private Double amount;

    private Instant createdAt;
}