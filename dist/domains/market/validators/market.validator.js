"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketListQuerySchema = void 0;
const zod_1 = require("zod");
exports.MarketListQuerySchema = zod_1.z.object({
    keyword: zod_1.z.string().optional(),
    grade: zod_1.z
        .enum(["ALL", "COMMON", "RARE", "SUPER_RARE", "LEGENDARY"])
        .optional(),
    genre: zod_1.z.enum(["전체", "여행", "풍경", "인물", "장소"]).optional(),
    status: zod_1.z.enum(["ALL", "ON_SALE", "SOLD_OUT", "CANCELED"]).optional(),
    sort: zod_1.z.enum(["recent", "old", "cheap", "expensive"]).optional(),
    limit: zod_1.z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : undefined)),
    cursor: zod_1.z.object({ id: zod_1.z.string(), createdAt: zod_1.z.string() }).optional(),
});
