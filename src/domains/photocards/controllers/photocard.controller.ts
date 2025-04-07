import { Request, Response, NextFunction } from "express";
import photocardService from "../services/photocard.service";
import { MyPhotocardsQuery } from "../types/photocard.type";

/**
 * 사용자의 포토카드 목록 조회
 * GET /api/photocards/me
 */
export const getMyPhotocards = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "로그인이 필요합니다.",
    });
    return;
  }

  const query = req.query as unknown as MyPhotocardsQuery;

  return photocardService
    .getMyPhotocards(userId, query)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      next(error);
    });
};

/**
 * 필터 옵션별 포토카드 개수 조회
 * GET /api/photocards/me/count
 */
export const getMyPhotocardsCount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "로그인이 필요합니다.",
    });
    return;
  }

  const { grade, genre } = req.query as { grade?: string; genre?: string };

  return photocardService
    .getMyPhotocardsCount(userId, { grade, genre })
    .then((result) => {
      res.status(200).json({
        grade: grade || "",
        genre: genre || "",
        count: result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

// 내보내기 형식 수정
export default {
  getMyPhotocards,
  getMyPhotocardsCount,
};
