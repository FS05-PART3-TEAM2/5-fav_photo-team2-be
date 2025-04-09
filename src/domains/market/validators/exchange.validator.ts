import { z } from "zod";

export const RequestCreateExchangeOfferSchema = z.object({
  saleCardId: z.string(),
  content: z.string().min(1),
});
