import { CustomError } from "./custom-error";

interface ConflictErrorItem {
  message: string;
}

export class ConflictError extends CustomError {
  statusCode = 409;

  constructor(public message: string) {
    super("Conflict error");

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
