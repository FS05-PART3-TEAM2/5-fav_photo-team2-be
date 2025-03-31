import { NextFunction, Request, Response } from "express";

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export type ApiSignature = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => Promise<void>;
