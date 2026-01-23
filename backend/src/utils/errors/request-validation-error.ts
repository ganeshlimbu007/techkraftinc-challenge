import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends Error implements CustomError {
  statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.type };
    });
  }
}
