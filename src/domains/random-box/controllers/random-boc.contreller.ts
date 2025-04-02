import { Request, Response } from "express";
import {
  drawRandomBox,
  getRemainingTime,
} from "../services/random-box.service";

export const open = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id; // 미들웨어에서 인증된 유저 ID

  const pointToAdd = req.body.amount || 10;
  try {
    const result = await drawRandomBox(userId, pointToAdd);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    if (err.code === "COOLDOWN") {
      res.status(429).json({
        error: err.message,
        nextAvailableAt: err.nextAvailableAt, // 타임스탬프 or ISO
      });
      return;
    }

    const cooldown = await getRemainingTime(userId);

    res.status(500).json({ error: "서버 에러 발생", cooldownInfo: cooldown });
    return;
  }
};

export const status = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;

  try {
    const result = await getRemainingTime(userId);
    res.status(200).json(result);
    return;
  } catch (err: any) {
    console.error("Status error:", err);
    res.status(500).json({ error: "서버 에러 발생" });
    return;
  }
};
