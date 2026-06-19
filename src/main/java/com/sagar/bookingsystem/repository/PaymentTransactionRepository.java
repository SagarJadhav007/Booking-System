package com.sagar.bookingsystem.repository;

import com.sagar.bookingsystem.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentTransactionRepository
        extends JpaRepository<
        PaymentTransaction,
        String> {
}