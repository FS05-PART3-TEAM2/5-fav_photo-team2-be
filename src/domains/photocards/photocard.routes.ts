import { Router } from "express";
import {
  getMyPhotocards,
  getMyPhotocardsCount,
  createPhotocard,
  uploadSingle,
} from "./controllers/photocard.controller";
import { requestHandler } from "../../utils/requestHandler";
import { validateAll } from "../../middlewares/validator.middleware";
import { PhotocardsQuerySchema } from "./validators/photocard.validator";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/me",
  authenticate,
  validateAll({ query: PhotocardsQuerySchema }),
  requestHandler(getMyPhotocards)
);

router.get("/me/count", authenticate, requestHandler(getMyPhotocardsCount));

// 포토카드 생성 라우트
router.post("/", authenticate, uploadSingle, requestHandler(createPhotocard));

export default router;
