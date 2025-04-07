import { Router } from "express";
import marketController from "./controllers/market.controller";
import marketDetailController, {
  getBasicDetailCtrl,
  getExchangeCtrl,
} from "./controllers/detail.controller";
import { requestHandler } from "../../utils/requestHandler";
import { validateAll } from "../../middlewares/validator.middleware";
import {
  MarketListCountQuerySchema,
  MarketListQuerySchema,
  MarketMeQuerySchema,
  RequestMarketItemSchema,
} from "./validators/market.validator";
import { declineOfferController } from "./controllers/exchange.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  cancelMarketItemCtrl,
  updateMarketItemCtrl,
} from "./controllers/market.update.controller";
import { UpdateMarketItemSchema } from "./validators/market.update.validators";

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
router.post(
  "/",
  authenticate,
  validateAll({ body: RequestMarketItemSchema }),
  requestHandler(marketController.createMarketItem)
);

router.patch(
  "/:id",
  authenticate,
  validateAll({ body: UpdateMarketItemSchema }),
  requestHandler(updateMarketItemCtrl)
);

router.patch("/:id/cancel", authenticate, requestHandler(cancelMarketItemCtrl));

router.get("/:id/detail", authenticate, requestHandler(getBasicDetailCtrl));

router.get("/:id/exchange", authenticate, requestHandler(getExchangeCtrl));

// Exchange routes
router.patch("/exchange/:id/decline", authenticate, declineOfferController);

export default router;
