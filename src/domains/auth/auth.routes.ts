import { Router } from "express";
import { login, signup } from "./controllers/auth.controller";
import { requestHandler } from "../../utils/requestHandler";

const router = Router();

router.post("/signup", requestHandler(signup));
router.post("/login", login);

export default router;
