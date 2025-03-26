import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const JWT_EXPIRES_IN = "1h";

export const signup = async (req: Request, res: Response) => {
  const { email, password, nickname } = req.body;

  try {
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      return res.status(409).json({ message: "존재하는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        role: "USER",
      },
    });

    return res.status(201).json({ message: "회원가입 성공", userId: user.id });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      message: "로그인 성공",
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "서버 오류", error });
  }
};
