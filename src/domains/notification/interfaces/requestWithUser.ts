import { Request } from "express";

export interface RequestWithUser extends Request {
  user: { id: string; role: string };
}

export type NotificationType =
  | "PHOTO_CREATED" // 판매등록
  | "PHOTO_SOLD" // 판매완료
  | "PHOTO_OFFER_RECEIVED" // 제시 받음
  | "PHOTO_OFFER_ACCEPTED" // 제시 수락
  | "PHOTO_OFFER_DECLINED" // 제시 거절
  | "POINT_RECEIVED"; // 포인트 지급
export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  message: string;
}
