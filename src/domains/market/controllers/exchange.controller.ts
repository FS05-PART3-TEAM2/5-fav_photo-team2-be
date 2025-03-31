import { Request, Response } from "express";
import { declineOffer } from "../services/exchange.service";

export const declineOfferController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const response = await declineOffer(id);

    res.status(200).json(response);
  } catch (error) {
    console.error("Exchange decline error:", error);
    res.status(500).json({ error: "Failed to decline exchange offer" });
  }
};
