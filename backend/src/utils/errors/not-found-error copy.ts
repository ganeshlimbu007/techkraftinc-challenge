import { CustomError } from "./custom-error";

export class NotFoundError extends Error implements CustomError {
  statusCode: number = 404;
  reason = "Resource not found";

  constructor() {
    super("Resource not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
