import { NextFunction, Request, Response } from "express";

interface RequestWithUser extends Request {
  user?: { id: string; role: string; email?: string; nickname?: string };
}

export type ApiSignature = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => Promise<void>;
