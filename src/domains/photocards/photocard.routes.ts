import { Router } from "express";
import photocardController, {
  getMyPhotocards,
  getMyPhotocardsCount,
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

export default router;
