import { Request, Response } from "express";
import {
  loginService,
  signupService,
  logoutService,
  refreshTokenService,
} from "../services/auth.service";
import { CustomError } from "../../../utils/errorHandler";
import { signupSchema, loginSchema } from "../../../zod/auth.schema";

export const signup = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "유효하지 않은 요청", error: parsed.error.errors });
  }
  try {
    const result = await signupService(parsed.data);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ message: "서버 오류", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "유효하지 않은 요청", error: parsed.error.errors });
  }
  try {
    const result = await loginService(parsed.data);
    if (result.cookie) {
      res.cookie("token", result.cookie.token, result.cookie.options);
    }
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ message: "서버 오류", error });
  }
};

export const logout = (req: Request, res: Response) => {
  logoutService(res);
  res.status(200).json({ message: "로그아웃 성공" });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  await refreshTokenService(req, res);
};
