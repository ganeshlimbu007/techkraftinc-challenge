import { Request, Response } from "express";
import { addTicket, listTickets } from "./ticket.service";

export async function getTickets(req: Request, res: Response) {
  const tickets = await listTickets();

  res.status(200).json({
    tickets: tickets.map((t) => ({
      id: t.id,
      tier: t.tier,
      price: t.price,
      totalQuantity: t.total_quantity,
      remainingQuantity: t.remaining_quantity,
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
    totalQuantity: ticket.total_quantity,
    remainingQuantity: ticket.remaining_quantity,
  });
}
