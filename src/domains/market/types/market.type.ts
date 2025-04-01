import { z } from "zod";
import { MarketListQuerySchema } from "../validators/market.validator";

export type GetMarketList = (
  queries: MarketListQuery
) => Promise<MarketListResponse>;

export type MarketListQuery = z.infer<typeof MarketListQuerySchema>;
export interface MarketListResponse {
  hasMore: boolean;
  nextCursor: {
    id: string;
    createdAt: string;
  };
  list: MarketResponse[];
}
export interface MarketResponse {
  saleCardId: string;
  userPhotoCardId: string;
  status: string;
  name: string;
  genre: string;
  grade: string;
  price: number;
  image: string;
  remaining: number;
  totoal: number;
  exchangeDescription?: string;
  exchangeGrade?: string;
  exchangeGenre?: string;
  owner: {
    id: string;
    nickname: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type MarketCardDto = {
  id: string;
  quantity: number;
  price: number;
  status: "ON_SALE" | "SOLD_OUT" | "CANCELED";
  exchangeDescription: string;
  exchangeGrade: "COMMON" | "RARE" | "SUPER_RARE" | "LEGENDARY";
  exchangeGenre: string;
  createdAt: string; // ISO string이므로 Date로 쓸 수도 있음
  updatedAt: string;
  sellerId: string;
  photoCardId: string;
  userPhotoCardId: string;
  seller: {
    id: string;
    nickname: string;
  };
  userPhotoCard: {
    quantity: number;
  };
  photoCard: {
    creator: {
      id: string;
      nickname: string;
    };
    name: string;
    genre: string;
    grade: "COMMON" | "RARE" | "SUPER_RARE" | "LEGENDARY";
    description: string;
    imageUrl: string;
  };
};
