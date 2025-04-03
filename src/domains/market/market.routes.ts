import { Router } from "express";
import marketController from "./controllers/market.controller";
import marketDetailController from "./controllers/detail.controller";
import { requestHandler } from "../../utils/requestHandler";
import { validateAll } from "../../middlewares/validator.middleware";
import {
  MarketListCountQuerySchema,
  MarketListQuerySchema,
  MarketMeQuerySchema,
} from "./validators/market.validator";
import { declineOfferController } from "./controllers/exchange.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  validateAll({ query: MarketListQuerySchema }),
  requestHandler(marketController.getMarketList)
);
router.get(
  "/count",
  validateAll({ query: MarketListCountQuerySchema }),
  requestHandler(marketController.getMarketListCount)
);
router.get(
  "/me",
  authenticate,
  validateAll({ query: MarketMeQuerySchema }),
  requestHandler(marketController.getMarketMe)
);
router.get(
  "/me/count",
  authenticate,
  validateAll({ query: MarketMeQuerySchema }),
  requestHandler(marketController.getMarketMeCount)
);

router.get(
  "/:id/detail",
  authenticate,
  marketDetailController.getMarketItemBasicDetail
);

router.get(
  "/:id/exchange",
  authenticate,
  marketDetailController.getMarketItemExchange
);

// Exchange routes
router.patch("/exchange/:id/decline", authenticate, declineOfferController);

export default router;
