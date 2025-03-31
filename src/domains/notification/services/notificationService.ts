import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 알림 조회 로직
export const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }, // 최신순 정렬
  });
};

// 알림 읽음 처리 로직
export const markNotificationAsRead = async (
  userId: string,
  notificationId: string
) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    throw new Error("알림을 찾을 수 없거나 권한이 없습니다.");
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
};
