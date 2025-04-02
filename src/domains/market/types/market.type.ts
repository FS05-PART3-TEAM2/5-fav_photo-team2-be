import { z } from "zod";
import {
  MarketListQuerySchema,
  MarketMeQuerySchema,
} from "../validators/market.validator";
import { DecodedUser } from "../../auth/interfaces/auth.interface";

export type GetMarketList = (
  queries: MarketListQuery
) => Promise<MarketListResponse>;
export type GetMarketMeList = (
  queires: MarketMeQuery,
  user: { id: string; role: string }
) => Promise<MarketMeListResponse>;

export type MarketListQuery = z.infer<typeof MarketListQuerySchema>;
export type MarketMeQuery = z.infer<typeof MarketMeQuerySchema>;

export interface PhotoCardInfo {
  name: string;
  count: number;
}

export interface MarketListResponse {
  hasMore: boolean;
  nextCursor: {
    id: string;
    createdAt: string;
  } | null;
  list: MarketResponse[];
}
export interface MarketMeListResponse {
  hasMore: boolean;
  nextCursor: {
    id: string;
    createdAt: string;
  } | null;
  list: MarketMeResponse[];
  photoCardInfo: PhotoCardInfo[];
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
