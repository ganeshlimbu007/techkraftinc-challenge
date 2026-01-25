import { Router } from "express";
import { createTicket, getTickets } from "./ticket.controller";
import { body } from "express-validator";
import { TicketTier } from "../../data/enums/ticket-tier";
import { validateRequest } from "../../middlewares/validate-request";

const router = Router();

router.get("/", getTickets);

router.post(
  "/",
  [
    body("tier")
      .notEmpty()
      .withMessage("Tier is required")
      .isIn(Object.values(TicketTier))
      .withMessage("Invalid ticket tier"),

    body("totalQuantity")
      .isInt({ gt: 0 })
      .withMessage("Total quantity must be greater than zero"),
  ],
  validateRequest,
  createTicket,
);

export { router as ticketRouter };
