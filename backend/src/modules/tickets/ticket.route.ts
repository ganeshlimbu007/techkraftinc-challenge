import { Router } from "express";
import { createTicket, getTickets } from "./ticket.controller";

const router = Router();

router.get("/", getTickets);

router.post("/", createTicket);

export { router as ticketRouter };
