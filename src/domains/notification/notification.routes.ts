import { Router } from "express";
import * as notificationController from "./controllers/notification.controller";

const router = Router();

router.get("/notifications", notificationController.getNotifications);
router.patch(
  "/notifications/:notificationId/read",
  notificationController.readNotification
);

export default router;
