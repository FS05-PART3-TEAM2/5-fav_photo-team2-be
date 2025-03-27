import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import randomBoxRoutes from "./random-box/random-box.routes";

const router = Router();
router.use("/auth", authRoutes);
router.use("/random-box", randomBoxRoutes);

export default router;
