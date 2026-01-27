import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./utils/errors/not-found-error";
import { ticketRouter } from "./modules/tickets/ticket.route";

import "./jobs/expire-reservations.job";
import { bookingRouter } from "./modules/bookings/booking.controller";
import { paymentRouter } from "./modules/bookings/payment.controller";

const app = express();

app.use(express.json());

app.use("/tickets", ticketRouter);
app.use(bookingRouter);
app.use(paymentRouter);
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, _res) => {
  throw new NotFoundError();
});
// error handler MUST be last
app.use(errorHandler);

export { app };
