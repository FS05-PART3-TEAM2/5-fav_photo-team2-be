import { Router } from "express";
import {
  declineOfferController,
  acceptOfferController,
} from "./controllers/exchange.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// Exchange routes
router.patch(
  "/api/market/exchange/:id/decline",
  authenticate,
  declineOfferController
);

router.patch(
  "/api/market/exchange/:id/accept",
  authenticate,
  acceptOfferController
);

export default router;
