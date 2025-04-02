"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.logout = exports.login = exports.signup = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../../../zod/auth.schema");
const errors_1 = require("../../../utils/errors");
/// 회원가입
const signup = async (req, res) => {
    const parsed = auth_schema_1.signupSchema.safeParse(req.body); //바디 데이터 검증
    if (!parsed.success) {
        throw new errors_1.CustomError("유효하지 않은 요청", 400);
    }
    const result = await (0, auth_service_1.signupService)(parsed.data);
    res.status(result.status).json(result.body);
};
exports.signup = signup;
// 로그인 컨트롤러
const login = async (req, res) => {
    const parsed = auth_schema_1.loginSchema.safeParse(req.body); //바디 데이터 검증
    if (!parsed.success) {
        throw new errors_1.CustomError("유효하지 않은 요청", 400);
    }
    const result = await (0, auth_service_1.loginService)(parsed.data);
    if (result.cookie) {
        res.cookie("token", result.cookie.token, result.cookie.options);
        res.cookie("refreshToken", result.cookie.refreshToken, {
            ...result.cookie.options,
            maxAge: 60 * 60 * 24 * 7 * 1000, // 7일
            httpOnly: true,
        });
        res.status(result.status).json(result.body);
    }
};
exports.login = login;
/// 로그아웃 컨트롤러
const logout = (req, res) => {
    (0, auth_service_1.logoutService)(res);
    res.status(200).json({ message: "로그아웃 성공" });
};
exports.logout = logout;
/// 리프레시 토큰 컨트롤러
const refreshAccessToken = async (req, res) => {
    await (0, auth_service_1.refreshTokenService)(req, res);
};
exports.refreshAccessToken = refreshAccessToken;
