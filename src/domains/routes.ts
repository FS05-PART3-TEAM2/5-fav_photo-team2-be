import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import photocardRoutes from "./market/photocard.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/photocard", photocardRoutes);

export default router;
