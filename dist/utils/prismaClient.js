"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"], // query 로그 활성화
});
exports.default = prisma;
