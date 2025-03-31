import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import marketRoutes from "./market/market.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/market", marketRoutes);

export default router;
