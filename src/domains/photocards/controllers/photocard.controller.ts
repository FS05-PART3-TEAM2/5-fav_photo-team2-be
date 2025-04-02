import { Request, Response, NextFunction } from "express";
import photocardService from "../services/photocard.service";
import { MyPhotocardsQuery } from "../types/photocard.type";

const getMyPhotocards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "로그인이 필요합니다.",
      });
      return;
    }

    const query = req.query as unknown as MyPhotocardsQuery;
    const result = await photocardService.getMyPhotocards(userId, query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getMyPhotocards,
};
