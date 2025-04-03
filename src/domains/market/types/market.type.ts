import { z } from "zod";
import {
  MarketListCountQuerySchema,
  MarketListQuerySchema,
  MarketMeQuerySchema,
} from "../validators/market.validator";
import { ExchangeOffer, SaleCard } from "@prisma/client";

export type MarketListQuery = z.infer<typeof MarketListQuerySchema>;
export type MarketListCountQuery = z.infer<typeof MarketListCountQuerySchema>;
export type MarketMeQuery = z.infer<typeof MarketMeQuerySchema>;

export type GetMarketList = (
  queries: MarketListQuery
) => Promise<MarketListResponse>;
export type GetMarketMeList = (
  queires: MarketMeQuery,
  user: { id: string; role: string }
) => Promise<MarketMeListResponse>;
export type GetMarketListCount = (
  queries: MarketListCountQuery
) => Promise<MarketListCountResponse>;
export type GetMarketMeCount = (
  queries: MarketListCountQuery,
  userId: string
) => Promise<MarketListCountResponse>;

export interface MarketListCountResponse {
  grade: string;
  genre: string;
  status: string;
  count: number;
}

export interface PhotoCardInfo {
  name: string;
  count: number;
}
export interface FilterPhotoCard {
  grade: PhotoCardInfo[] | null;
  genre: PhotoCardInfo[] | null;
  status: PhotoCardInfo[] | null;
}

export interface MarketListResponse {
  hasMore: boolean;
  nextCursor: {
    id: string;
    createdAt: string;
  } | null;
  list: MarketResponse[];
  info: FilterPhotoCard;
}
export interface MarketMeListResponse {
  hasMore: boolean;
  nextCursor: {
    id: string;
    createdAt: string;
  } | null;
  list: MarketMeResponse[];
  info: FilterPhotoCard;
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
  total: number;
  exchangeDescription?: string;
  exchangeGrade?: string;
  exchangeGenre?: string;
  creator: {
    id: string;
    nickname: string;
  };
  seller: {
    id: string;
    nickname: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface MarketMeResponse {
  saleCardId: string;
  status: string;
  name: string;
  genre: string;
  grade: string;
  price: number;
  image: string;
  remaining: number;
  total: number;
  creator: {
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
  status: string;
  exchangeDescription: string;
  exchangeGrade: string;
  exchangeGenre: string;
  createdAt: Date; // ISO string이므로 Date로 쓸 수도 있음
  updatedAt: Date;
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
    grade: string;
    description: string;
    imageUrl: string;
  };
};
export type MarketMyCardDto = {
  id: string;
  type: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  saleCardId: string | null;
  exchangeOfferId: string | null;
  saleCard: SaleCard | null;
  exchangeOffer: ExchangeOffer | null;
};
