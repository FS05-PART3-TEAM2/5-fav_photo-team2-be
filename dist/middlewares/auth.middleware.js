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
    if (!token) {
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
        res.status(401).json({ message: "유효하지 않은 토큰입니다" });
        return;
    }
};
exports.authenticate = authenticate;
