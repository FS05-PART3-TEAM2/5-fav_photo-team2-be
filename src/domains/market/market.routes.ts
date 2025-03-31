import { Router } from "express";
import { declineOfferController } from "./controllers/exchange.controller";

const router = Router();

// Exchange routes
router.patch("/api/market/exchange/:id/decline", declineOfferController);

export default router;
