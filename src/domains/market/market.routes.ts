import express from "express";
import marketController from "./controllers/market.controller";
import { requestHandler } from "../../utils/requestHandler";
import { validateAll } from "../../middlewares/validator.middleware";
import { MarketListQuerySchema } from "./validators/market.validator";
import { declineOfferController } from "./controllers/exchange.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/",
  validateAll({ query: MarketListQuerySchema }),
  requestHandler(marketController.getMarketList)
);

// Exchange routes
router.patch(
  "/api/market/exchange/:id/decline",
  authenticate,
  declineOfferController
);

export default router;
