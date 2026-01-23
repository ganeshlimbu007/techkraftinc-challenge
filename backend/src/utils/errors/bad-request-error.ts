import { CustomError } from "./custom-error";

export class BadRequestError extends Error implements CustomError {
  statusCode: number = 400;
  reason: string = "Bad Request";

  constructor(message: string) {
    super(message);
    this.reason = message || this.reason;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
