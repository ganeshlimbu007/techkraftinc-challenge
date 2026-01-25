import { TICKET_PRICING } from "../../data/enums/ticket-tier";
import { ConflictError } from "../../utils/errors/conflict-error";
import { RequestValidationError } from "../../utils/errors/request-validation-error";
import { createTicket, getAllTickets } from "./ticket.repo";
import { CreateTicketInput, TicketRow } from "./ticket.type";

export async function addTicket(input: CreateTicketInput): Promise<TicketRow> {
  const { tier, totalQuantity } = input;

  if (!tier) {
    throw new RequestValidationError([
      { msg: "Tier is required", type: "tier" },
    ]);
  }

  if (totalQuantity <= 0) {
    throw new RequestValidationError([
      {
        msg: "Total quantity must be greater than zero",
        type: "totalQuantity",
      },
    ]);
  }

  // 2️⃣ Derive price from enum (doc-enforced)
  const price = TICKET_PRICING[tier as unknown as keyof typeof TICKET_PRICING];

  try {
    // 3️⃣ Persist via repo
    return await createTicket({
      tier,
      price,
      totalQuantity,
    });
  } catch (err: any) {
    // 4️⃣ Translate DB errors → domain errors
    if (err.code === "23505") {
      // unique constraint violation (tier already exists)
      throw new ConflictError();
    }
    throw err;
  }
}

export async function listTickets() {
  return getAllTickets();
}
