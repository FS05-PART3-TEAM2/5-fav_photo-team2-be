import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

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
