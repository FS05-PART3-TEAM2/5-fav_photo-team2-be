import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import marketRoutes from "./market/market.routes";
import notificationRoutes from "./notification/notification.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/market", marketRoutes);
router.use("/notifications", notificationRoutes);

export default router;
