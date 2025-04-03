"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketListCountQuerySchema = exports.MarketMeQuerySchema = exports.MarketListQuerySchema = void 0;
const zod_1 = require("zod");
exports.MarketListQuerySchema = zod_1.z.object({
    keyword: zod_1.z.string().optional(),
    grade: zod_1.z
        .enum(["ALL", "COMMON", "RARE", "SUPER_RARE", "LEGENDARY"])
        .optional(),
    genre: zod_1.z
        .enum(["ALL", "LANDSCAPE", "PORTRAIT", "TRAVEL", "OBJECT"])
        .optional(),
    status: zod_1.z.enum(["ALL", "ON_SALE", "SOLD_OUT", "CANCELED"]).optional(),
    sort: zod_1.z.enum(["recent", "old", "cheap", "expensive"]).optional(),
    limit: zod_1.z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 15) : undefined)),
    cursor: zod_1.z.object({ id: zod_1.z.string(), createdAt: zod_1.z.string() }).optional(),
});
exports.MarketMeQuerySchema = zod_1.z.object({
    keyword: zod_1.z.string().optional(),
    grade: zod_1.z
        .enum(["ALL", "COMMON", "RARE", "SUPER_RARE", "LEGENDARY"])
        .optional(),
    genre: zod_1.z
        .enum(["ALL", "LANDSCAPE", "PORTRAIT", "TRAVEL", "OBJECT"])
        .optional(),
    status: zod_1.z.enum(["ALL", "ON_SALE", "SOLD_OUT", "PENDING"]).optional(),
    limit: zod_1.z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 15) : undefined)),
    cursor: zod_1.z.object({ id: zod_1.z.string(), createdAt: zod_1.z.string() }).optional(),
});
exports.MarketListCountQuerySchema = zod_1.z.object({
    grade: zod_1.z.enum(["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"]).optional(),
    genre: zod_1.z
        .enum(["ALL", "LANDSCAPE", "PORTRAIT", "TRAVEL", "OBJECT"])
        .optional(),
    status: zod_1.z.enum(["ON_SALE", "SOLD_OUT", "PENDING"]).optional(),
});
