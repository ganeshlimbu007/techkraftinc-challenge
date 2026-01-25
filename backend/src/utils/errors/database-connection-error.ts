import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends Error implements CustomError {
  statusCode: number = 500;
  reason = "Unable to connect to database";
  constructor() {
    super("Unable to connect to database");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
