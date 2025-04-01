"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationController = exports.readNotification = exports.getNotifications = void 0;
const notificationService = __importStar(require("../services/notificationService"));
// 알림 조회 요청 처리
const getNotifications = async (req, res) => {
    const userId = req.user.id;
    try {
        const notifications = await notificationService.getUserNotifications(userId);
        res.status(200).json({ notifications });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "서버 오류", error });
        return;
    }
};
exports.getNotifications = getNotifications;
//알림 열람 처리
const readNotification = async (req, res) => {
    const userId = req.user.id;
    const { notificationId } = req.params; // URL 파라미터에서 알림 ID 가져오기
    try {
        const updated = await notificationService.markNotificationAsRead(userId, notificationId);
        res.status(200).json({ message: "읽음 처리 완료", updated });
        return;
    }
    catch (error) {
        res.status(404).json({ message: "음.. 알 수 없는 에러다", error });
        return;
    }
};
exports.readNotification = readNotification;
const createNotificationController = async (req, res) => {
    const userId = req.user.id;
    const { type, message } = req.body; // 알림 타입과 메시지
    const result = await notificationService.createNotification({
        userId,
        message,
    });
    if (!result) {
        res.status(500).json({
            message: "알림 생성 실패",
        });
        return;
    }
    res.status(201).json({
        message: "알림 생성 완료",
    });
    return;
};
exports.createNotificationController = createNotificationController;
