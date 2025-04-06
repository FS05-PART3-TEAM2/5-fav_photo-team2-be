import { z } from "zod";
import {
  CancelMarketItemSchema,
  UpdateMarketItemSchema,
} from "../validators/market.update.validators";

// 검증 스키마로부터 타입 추론
export type UpdateMarketItemRequest = z.infer<typeof UpdateMarketItemSchema>;
export type CancelMarketItemRequest = z.infer<typeof CancelMarketItemSchema>;

// 서비스 함수 타입 정의
export type UpdateMarketItem = (
  saleCardId: string,
  body: UpdateMarketItemRequest,
  userId: string
) => Promise<MarketItemResponse>;

export type CancelMarketItem = (
  body: CancelMarketItemRequest,
  userId: string
) => Promise<MarketItemResponse>;

// 응답 타입 정의
export type MarketItemResponse = {
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
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    nickname: string;
  };
  exchangeOffer: {
    description: string;
    grade: string;
    genre: string;
  };
};
