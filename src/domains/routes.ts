import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import notificationRoutes from "./notification/notification.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/notifications", notificationRoutes);

export default router;
