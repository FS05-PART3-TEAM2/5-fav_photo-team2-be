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
      userId: string;
      role: string;
      email?: string;
    };
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    console.log("미들 웨어 검증 후 req.user 반환", req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다" });
    return;
  }
};
