import { CustomError } from "./custom-error";

interface ConflictErrorItem {
  message: string;
}

export class ConflictError extends CustomError {
  statusCode = 409;
  reason = "Ticket tier already exists";
  constructor() {
    super("Conflict error");

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
