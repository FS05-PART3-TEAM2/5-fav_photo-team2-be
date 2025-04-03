import { z } from "zod";

export const PhotocardsQuerySchema = z.object({
  keyword: z.string().optional(),
  grade: z
    .enum(["ALL", "COMMON", "RARE", "SUPER_RARE", "LEGENDARY"])
    .optional()
    .default("ALL"),
  genre: z
    .enum(["전체", "Nature", "Animal", "Portrait", "Cityscape", "Abstract"])
    .optional()
    .default("전체"),
  sort: z.enum(["desc", "asc"]).optional().default("desc"),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 15)),
  cursor: z
    .object({
      id: z.string(),
      createdAt: z.string(),
    })
    .optional(),
});
