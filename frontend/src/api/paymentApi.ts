import api from "./axios";

export const startPayment =
    async (
        seatId: string
    ) => {

        return api.post(
            "/payments/start",
            {
                seatId
            }
        );
    };

export const confirmPayment =
    async (
        seatId: string
    ) => {

        return api.post(
            "/payments/confirm",
            {
                seatId,

                paymentId:
                    crypto.randomUUID(),

                idempotencyKey:
                    crypto.randomUUID()
            }
        );
    };