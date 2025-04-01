import { Router } from "express";
import * as notificationController from "./controllers/notification.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, notificationController.getNotifications);
router.patch(
  "/:notificationId/read",
  authenticate,
  notificationController.readNotification
);
router.post(
  "/",
  authenticate,
  notificationController.createNotificationController
); // 알림 생성 API

export default router;
