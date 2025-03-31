import { Request, Response } from "express";
import { declineOffer, acceptOffer } from "../services/exchange.service";

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

export const acceptOfferController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const response = await acceptOffer(id);

    res.status(200).json(response);
  } catch (error) {
    console.error("Exchange accept error:", error);
    res.status(500).json({ error: "Failed to accept exchange offer" });
  }
};
