import { Request, Response } from "express";
import { RequestWithUser } from "../interfaces/requestWithUser";
import * as notificationService from "../services/notificationService";

// 알림 조회 요청 처리
export const getNotifications = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }

  try {
    const notifications = await notificationService.getUserNotifications(
      userId
    );
    res.status(200).json({ notifications });
    return;
  } catch (error) {
    res.status(500).json({ message: "서버 오류", error });
    return;
  }
};

//알림 열람람청 처리리
export const readNotification = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { notificationId } = req.params;

  if (!userId) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }

  try {
    const updated = await notificationService.markNotificationAsRead(
      userId,
      notificationId
    );
    res.status(200).json({ message: "읽음 처리 완료", updated });
    return;
  } catch (error) {
    res.status(404).json({ message: error });
    return;
  }
};
