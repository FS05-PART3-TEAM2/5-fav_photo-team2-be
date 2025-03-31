import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import marketDetailRoutes from "./market/marketDetail/marketDetail.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/market", marketDetailRoutes);

export default router;
