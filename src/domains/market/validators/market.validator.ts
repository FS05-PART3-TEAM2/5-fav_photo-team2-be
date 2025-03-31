import { z } from "zod";

export const MarketListQuerySchema = z.object({
  keyword: z.string().optional(),
  grade: z
    .enum(["ALL", "COMMON", "RARE", "SUPER_RARE", "LEGENDARY"])
    .optional(),
  genre: z.enum(["전체", "여행", "풍경", "인물", "장소"]).optional(),
  status: z.enum(["ALL", "ON_SALE", "SOLD_OUT", "CANCELED"]).optional(),
  sort: z.enum(["recent", "old", "cheap", "expensive"]).optional(),
  limit: z.number().optional(),
  cursor: z.object({ id: z.string(), createdAt: z.string() }).optional(),
});
