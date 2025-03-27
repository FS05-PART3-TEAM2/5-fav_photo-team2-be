import { Request, Response } from "express";
import * as service from "../services/random-box.service";

export const open = async (req: Request, res: Response) => {
  const userId = req.user.id; // 미들웨어에서 토큰 인증 후 주입된 값

  try {
    const result = await service.openRandomBox(userId);
    return res.status(200).json(result);
  } catch (err: any) {
    if (err.status === 429) {
      return res.status(429).json({
        error: "Cooldown active",
        nextAvailableAt: err.nextAvailableAt,
      });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const status = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await service.canOpenRandomBox(userId);
  return res.status(200).json(result);
};
