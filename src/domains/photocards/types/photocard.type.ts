import { z } from "zod";
import { PhotocardsQuerySchema } from "../validators/photocard.validator";

export type GetMyPhotocards = (
  userId: string,
  queries: MyPhotocardsQuery
) => Promise<MyPhotocardsResponse>;

export type MyPhotocardsQuery = z.infer<typeof PhotocardsQuerySchema>;

export interface MyPhotocardsResponse {
  success: boolean;
  userNickname: string;
  gradeCounts: GradeCounts;
  data: PhotocardResponse[];
  nextCursor: CursorType | null;
  hasMore: boolean;
}

export interface GradeCounts {
  COMMON: number;
  RARE: number;
  SUPER_RARE: number;
  LEGENDARY: number;
}

export interface CursorType {
  id: string;
  createdAt: string;
}

export interface PhotocardResponse {
  id: string;
  name: string;
  imageUrl: string;
  grade: string;
  genre: string;
  description: string;
  price: number;
  amount: number;
  createdAt: string;
  creatorNickname: string;
}

export type PhotocardDto = {
  id: string;
  name: string;
  imageUrl: string;
  grade: string;
  genre: string;
  description: string;
  price: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
