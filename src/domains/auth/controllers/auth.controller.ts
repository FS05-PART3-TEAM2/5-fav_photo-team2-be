import { Request, Response } from "express";
import { CustomError } from "../../../utils/errorHandler";

export const signup = async (req: Request, res: Response) => {
  throw new CustomError("에러 발생", 400);
  res.status(201).json({ message: "회원가입 성공" });
};

export const login = async (req: Request, res: Response) => {
  res.status(200).json({ message: "로그인 성공" });
};
