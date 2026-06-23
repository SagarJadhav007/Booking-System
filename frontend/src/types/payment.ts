export interface StartPaymentRequest {
    seatId: string;
}

export interface ConfirmPaymentRequest {
    seatId: string;
    paymentId: string;
    idempotencyKey: string;
}