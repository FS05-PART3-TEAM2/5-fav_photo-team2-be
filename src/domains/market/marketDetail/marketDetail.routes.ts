import express, { Router } from "express";
import marketDetailController from "./controllers/marketDetail.controller";

const router: Router = express.Router();

// 마켓플레이스 상세 조회 라우트
router.get("/:id", marketDetailController.getMarketItemDetail);

export default router;
