import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "인증되지 않은 사용자 입니다." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
      email?: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다" });
    return;
  }
};
