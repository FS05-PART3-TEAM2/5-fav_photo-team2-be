import { z } from "zod";
import { MarketListQuerySchema } from "../validators/market.validator";

export type GetMarketList = (
  queries: MarketListQuery
) => Promise<MarketListResponse>;

export type MarketListQuery = z.infer<typeof MarketListQuerySchema>;
export interface MarketListResponse {}
