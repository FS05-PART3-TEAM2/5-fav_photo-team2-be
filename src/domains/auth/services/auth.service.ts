import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignupDTO, LoginDTO } from "../dtos/auth.dto";
import { AuthResponse } from "../interfaces/auth.interface";
import { Response } from "express";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const JWT_EXPIRES_IN = "1h";

export const signupService = async (data: SignupDTO): Promise<AuthResponse> => {
  const { email, password, nickname } = data;
  const existUser = await prisma.user.findUnique({ where: { email } });

  if (existUser) {
    return { status: 409, body: { message: "존재하는 이메일입니다." } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, nickname, role: "USER" },
  });

  return {
    status: 201,
    body: { message: "회원가입 성공", userId: user.id },
  };
};

export const loginService = async (data: LoginDTO): Promise<AuthResponse> => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      status: 401,
      body: { message: "이메일 또는 비밀번호가 잘못되었습니다." },
    };
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    status: 200,
    body: {
      message: "로그인 성공",
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    },
    cookie: {
      token: accessToken,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      },
    },
  };
};

export const logoutService = (res: Response): void => {
  res.clearCookie("token");
  res.status(200).json({ message: "로그아웃 성공" });
};
