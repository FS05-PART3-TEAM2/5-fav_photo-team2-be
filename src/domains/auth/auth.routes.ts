import { Router } from "express";
import {
  login,
  refreshAccessToken,
  signup,
} from "./controllers/auth.controller";
import { requestHandler } from "../../utils/requestHandler";
import { authenticate } from "../../middlewares/auth.middleware";
const router = Router();

router.post("/signup", requestHandler(signup));
router.post("/login", requestHandler(login));
router.post("/refresh", requestHandler(refreshAccessToken));
router.get(
  "/me",
  authenticate,
  requestHandler((req, res) => {
    res.status(200).json({
      user: {
        id: req.user.id,
        role: req.user.role,
      },
    });
  })
);

export default router;
