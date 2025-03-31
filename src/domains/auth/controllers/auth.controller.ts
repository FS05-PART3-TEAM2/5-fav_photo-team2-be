import { Request, Response } from "express";
import {
  loginService,
  signupService,
  logoutService,
} from "../services/auth.service";
import { CustomError } from "../../../utils/errorHandler";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await signupService(req.body);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ message: "서버 오류", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
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
