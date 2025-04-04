import { z } from "zod";
import {
  PHOTOCARD_GENRES,
  PHOTOCARD_GRADES,
} from "../constants/filter.constant";

export const PhotocardsQuerySchema = z.object({
  keyword: z.string().optional(),
  grade: z
    .enum(["ALL", ...PHOTOCARD_GRADES])
    .optional()
    .default("ALL"),
  genre: z
    .enum(["전체", ...PHOTOCARD_GENRES])
    .optional()
    .default("전체"),
  sort: z.enum(["desc", "asc", "latest", "oldest"]).optional().default("desc"),
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
