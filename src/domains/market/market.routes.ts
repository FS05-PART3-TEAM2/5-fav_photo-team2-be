import express from "express";
import marketController from "./controllers/market.controller";
import { requestHandler } from "../../utils/requestHandler";
import { validateAll } from "../../middlewares/validator.middleware";
import { MarketListQuerySchema } from "./validators/market.validator";

const router = express.Router();

router.get(
  "/",
  validateAll({ query: MarketListQuerySchema }),
  requestHandler(marketController.getMarketList)
);

export default router;
