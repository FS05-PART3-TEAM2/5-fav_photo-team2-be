import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errorHandler";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiInfo = `${req.method} ${req.originalUrl}`;

  if (error instanceof CustomError) {
    res.status(error.statusCode).send({ error: error.message });
    return;
  }

  console.error(`${apiInfo} :: ${error.message}`);
  res.status(500).send({ error: "Internal Server Error" });
  return;
};
