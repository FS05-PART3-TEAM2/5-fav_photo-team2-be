import { Router } from "express";
import { declineOfferController } from "./controllers/exchange.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// Exchange routes
router.patch(
  "/api/market/exchange/:id/decline",
  authenticate,
  declineOfferController
);

export default router;
