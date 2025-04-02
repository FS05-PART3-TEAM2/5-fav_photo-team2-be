import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { RequestHandler } from "express";
import { requestHandler } from "../../utils/requestHandler";
import { open } from "./controllers/random-boc.contreller";
import { status } from "./controllers/random-boc.contreller";

const router = Router();

router.get("/", authenticate, requestHandler(status));

router.post("/", authenticate, requestHandler(open));
export default router;
