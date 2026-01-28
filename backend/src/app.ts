import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./utils/errors/not-found-error";
import { ticketRouter } from "./modules/tickets/ticket.route";
import cors from "cors";
import "./jobs/expire-reservations.job";
import { bookingRouter } from "./modules/bookings/booking.controller";
import { paymentRouter } from "./modules/bookings/payment.controller";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
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
