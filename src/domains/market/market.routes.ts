import { Router } from "express";
import marketDetailController from "./controllers/detail.controller";
import { declineOfferController } from "./controllers/exchange.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();
// 마켓플레이스 상세 조회 라우트
router.get("/:id", authenticate, marketDetailController.getMarketItemDetail);

// Exchange routes
router.patch("/exchange/:id/decline", authenticate, declineOfferController);

export default router;
