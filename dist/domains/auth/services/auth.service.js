"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenService = exports.logoutService = exports.loginService = exports.signupService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../../utils/errors");
const prismaClient_1 = __importDefault(require("../../../utils/prismaClient"));
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const JWT_EXPIRES_IN = "1h";
const ACCESS_EXPIRES_IN = "1h";
const isProd = process.env.NODE_ENV === "production";
// 회원가입 서비스
const signupService = async (data) => {
    const { email, password, nickname } = data;
    const existUser = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (existUser) {
        throw new errors_1.CustomError("이미 존재하는 이메일입니다.", 409);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prismaClient_1.default.user.create({
        data: { email, password: hashedPassword, nickname, role: "USER" },
    });
    return {
        status: 201,
        body: { message: "회원가입 성공", userId: user.id },
    };
};
exports.signupService = signupService;
/// 로그인 서비스
const loginService = async (data) => {
    const { email, password } = data;
    const user = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
        throw new errors_1.CustomError("이메일 또는 비밀번호가 잘못되었습니다.", 401);
    }
    // accessToken 생성
    const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // refreshToken 생성
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // refreshToken DB에 저장
    await prismaClient_1.default.auth.upsert({
        where: { userId: user.id },
        update: { refreshToken, expiresAt: refreshExpiresAt },
        create: {
            userId: user.id,
            refreshToken,
            expiresAt: refreshExpiresAt,
        },
    });
    return {
        status: 200,
        body: {
            message: "로그인 성공",
            accessToken: accessToken,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            },
        },
        cookie: {
            token: accessToken,
            refreshToken: refreshToken,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000,
            },
        },
    };
};
exports.loginService = loginService;
/// 로그아웃 서비스
const logoutService = (res) => {
    res.clearCookie("token, refreshToken");
    res.status(200).json({ message: "로그아웃 성공" });
};
exports.logoutService = logoutService;
/// 리프레시 토큰 서비스
const refreshTokenService = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new errors_1.CustomError("refreshToken 없음", 401);
    }
    const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
    const authRecord = await prismaClient_1.default.auth.findUnique({
        where: { userId: decoded.userId },
    });
    if (!authRecord || authRecord.refreshToken !== refreshToken) {
        throw new errors_1.CustomError("유효하지 않은 refreshToken", 403);
    }
    const newAccessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId, role: decoded.role }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
    res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({ message: "accessToken 재발급 완료" });
};
exports.refreshTokenService = refreshTokenService;
