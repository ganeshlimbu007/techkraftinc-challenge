import { Router } from "express";
import { createReservation, confirmBooking } from "./booking.controller";

const router = Router();

router.post("/reservations", createReservation);
router.post("/payments/confirm", confirmBooking);

export { router as bookingRouter };
