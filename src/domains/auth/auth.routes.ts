import { Router } from "express";
import {
  login,
  refreshAccessToken,
  signup,
} from "./controllers/auth.controller";
import { requestHandler } from "../../utils/requestHandler";
const router = Router();

router.post("/signup", requestHandler(signup));
router.post("/login", requestHandler(login));
router.post("/refresh", requestHandler(refreshAccessToken));

export default router;
