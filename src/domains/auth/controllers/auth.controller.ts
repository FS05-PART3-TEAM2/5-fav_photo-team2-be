import { Request, Response } from "express";
import {
  loginService,
  signupService,
  logoutService,
  refreshTokenService,
} from "../services/auth.service";
import { CustomError } from "../../../utils/errorHandler";
import { signupSchema, loginSchema } from "../../../zod/auth.schema";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const parsed = signupSchema.safeParse(req.body); //바디 데이터 검증
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "유효하지 않은 요청", error: parsed.error.errors });
    return;
  }
  const result = await signupService(parsed.data);
  res.status(result.status).json(result.body);

  throw new CustomError("서버 오류 발생", 500);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body); //바디 데이터 검증
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "유효하지 않은 요청", error: parsed.error.errors });
    return;
  }
  const result = await loginService(parsed.data);
  if (result.cookie) {
    res.cookie("token", result.cookie.token, result.cookie.options);
  }
  res.status(result.status).json(result.body);

  throw new CustomError("서버 오류 발생", 500);
};

export const logout = (req: Request, res: Response) => {
  logoutService(res);
  res.status(200).json({ message: "로그아웃 성공" });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  await refreshTokenService(req, res);

  throw new CustomError("서버 오류 발생", 500);
};
