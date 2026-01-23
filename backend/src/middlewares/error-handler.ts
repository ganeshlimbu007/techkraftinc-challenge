import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send(err.serializeErrors());
    return;
  }

  res.status(400).send([{ msg: err.message || "Something went wrong" }]);
};
