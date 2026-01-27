import { Request, Response } from "express";
import { addTicket, listTickets } from "./ticket.service";

export async function getTickets(req: Request, res: Response) {
  const tickets = await listTickets();

  res.status(200).json({
    tickets: tickets.map((t) => ({
      id: t.id,
      tier: t.tier,
      price: t.price,
      status: t.status,
    })),
  });
}

export async function createTicket(req: Request, res: Response) {
  const { tier, totalQuantity } = req.body;

  const ticket = await addTicket({
    tier,
    totalQuantity,
  });

  res.status(201).json({
    id: ticket.id,
    tier: ticket.tier,
    price: ticket.price,
  });
}
