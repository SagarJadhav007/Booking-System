package com.sagar.bookingsystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReserveSeatRequest {

    @NotBlank
    private String seatId;
}