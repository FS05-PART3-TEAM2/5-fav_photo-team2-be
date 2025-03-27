import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.send("랜덤박스 뽑기~~~~");
});

router.get("/", (req, res) => {
  res.send("랜덤박스 조회~~~~");
});

export default router;
