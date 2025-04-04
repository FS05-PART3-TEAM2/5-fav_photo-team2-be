import { Request, Response } from "express";
import { declineOffer, acceptOffer } from "../services/exchange.service";
import { CustomError } from "../../../utils/errors";

export const declineOfferController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // 사용자 인증 확인
    if (!req.user) {
      res.status(401).json({ message: "인증이 필요합니다." });
      return;
    }
    const userId = req.user.id;

    const response = await declineOffer(id, userId);

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Exchange decline error:", error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to decline exchange offer" });
    }
  }
};

export const acceptOfferController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // 사용자 인증 확인
    if (!req.user) {
      res.status(401).json({ message: "인증이 필요합니다." });
      return;
    }
    const userId = req.user.id;

    const response = await acceptOffer(id, userId);

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Exchange accept error:", error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to accept exchange offer" });
    }
  }
};
