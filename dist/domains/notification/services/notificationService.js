"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.markNotificationAsRead = exports.getUserNotifications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 알림 조회 로직
const getUserNotifications = async (userId) => {
    console.log("userId", userId);
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }, // 최신순 정렬
    });
};
exports.getUserNotifications = getUserNotifications;
// 알림 읽음 처리 로직
const markNotificationAsRead = async (userId, notificationId) => {
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId, userId },
    });
    if (!notification || notification.userId !== userId) {
        throw new Error("알림을 찾을 수 없거나 권한이 없습니다.");
    }
    return await prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
    });
};
exports.markNotificationAsRead = markNotificationAsRead;
// 알림 생성 로직
const createNotification = async (input) => {
    const { userId, message } = input;
    return await prisma.notification.create({
        data: {
            userId,
            message,
        },
    });
};
exports.createNotification = createNotification;
