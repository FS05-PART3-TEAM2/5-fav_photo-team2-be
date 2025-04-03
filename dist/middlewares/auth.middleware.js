"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    if (!token && !refreshToken) {
        res.status(401).json({ message: "인증되지 않은 사용자 입니다." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };
        console.log("미들 웨어 검증 후 req.user 반환", req.user);
        next();
    }
    catch (err) {
        // 토큰 만료 됐을때
        if (refreshToken) {
            try {
                //리프레시 토큰 검증
                const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
                //새 액세스 토큰 발급
                const newToken = jsonwebtoken_1.default.sign({ userId: decoded.userId, role: decoded.role }, JWT_SECRET, { expiresIn: "1h" });
                res.cookie("token", newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 3600000,
                });
                req.user = {
                    id: decoded.userId,
                    role: decoded.role,
                };
                next();
                return;
            }
            catch (err) {
                // 리프레시 토큰 만료 됐을때
                res.status(401).json({ message: "유효하지 않은 refreshToken" });
                return;
            }
        }
        res.status(401).json({ message: "유효하지 않은 토큰입니다" });
        return;
    }
};
exports.authenticate = authenticate;
