import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtUserPayload {
  userId: string;
  role: string;
}

// 로그인 되어있는지 검사사
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtUserPayload;
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};
