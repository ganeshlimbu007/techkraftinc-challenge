import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./utils/errors/not-found-error";
import { ticketRouter } from "./modules/tickets/ticket.route";
import { bookingRouter } from "./modules/bookings/bookings.routes";
import "./jobs/expire-reservations.job";

const app = express();

app.use(express.json());

app.use("/tickets", ticketRouter);
app.use("/bookings", bookingRouter);
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, _res) => {
  throw new NotFoundError();
});
// error handler MUST be last
app.use(errorHandler);

export { app };
