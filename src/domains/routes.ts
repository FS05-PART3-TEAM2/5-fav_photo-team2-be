import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import marketRoutes from "./market/market.routes";
import notificationRoutes from "./notification/notification.routes";
import photocardRoutes from "./photocards/photocard.routes";
import randomBoxRoutes from "./random-box/random-box.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/market", marketRoutes);
router.use("/notifications", notificationRoutes);
router.use("/photocards", photocardRoutes);
router.use("/random-box", randomBoxRoutes);

export default router;
