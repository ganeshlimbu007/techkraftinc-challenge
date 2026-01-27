import { pool } from "../../db";
import { loadSql } from "../../db/sql/load-sql";
import { TicketPriceType, TicketRow, TicketTierType } from "./ticket.type";

const createTicketSql = loadSql("create-ticket.sql");

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
  const res = await pool.query(`
    SELECT
      id,
      tier,
      price,
      status
    FROM tickets
    ORDER BY tier, price, created_at
  `);

  return res.rows;
}
