import { pool } from "../../db";
import { loadSql } from "../../db/sql/load-sql";
import { TicketPriceType, TicketRow, TicketTierType } from "./ticket.type";

const createTicketSql = loadSql("create-ticket.sql");

const getTicketsSql = loadSql("get-tickets.sql");

export async function createTicket(params: {
  tier: TicketTierType;
  price: TicketPriceType;
  totalQuantity: number;
}): Promise<TicketRow> {
  const { tier, price, totalQuantity } = params;

  const result = await pool.query(createTicketSql, [
    tier,
    price,
    totalQuantity,
  ]);

  return result.rows[0];
}

export async function getAllTickets(): Promise<TicketRow[]> {
  const result = await pool.query(getTicketsSql);
  return result.rows;
}
