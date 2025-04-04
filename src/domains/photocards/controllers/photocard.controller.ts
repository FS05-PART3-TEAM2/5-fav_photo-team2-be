import { Request, Response, NextFunction, RequestHandler } from "express";
import photocardService from "../services/photocard.service";
import { MyPhotocardsQuery } from "../types/photocard.type";
import { PHOTOCARD_FILTER_CONFIG } from "../constants/filter.constant";

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
  return photocardService.getMyPhotocards(userId, query).then((result) => {
    res.status(200).json({
      userNickname: result.userNickname,
      gradeCounts: result.gradeCounts,
      data: result.data,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      filterInfo: result.filterInfo,
    });
  });
};

/**
 * 필터 설정 조회
 * GET /api/photocards/filters
 */
export const getFilterConfig = (req: Request, res: Response) => {
  res.status(200).json({
    filterConfig: PHOTOCARD_FILTER_CONFIG,
  });
};

// 내보내기 형식 수정
export default {
  getMyPhotocards,
  getFilterConfig,
};
