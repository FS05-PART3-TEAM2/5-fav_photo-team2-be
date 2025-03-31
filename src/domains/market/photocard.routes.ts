/**
 * 포토카드 관련 라우트 정의
 *
 * Express 라우터를 사용하여 API 경로 설정
 */

import { Router } from "express";
import photocardController from "./controllers/photocard.controller";

const router = Router();

// GET /api/photocards/:id - 포토카드 상세 조회
router.get("/:id", photocardController.getPhotoCardDetail);

export default router;
