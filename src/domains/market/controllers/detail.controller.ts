import { Request, Response, NextFunction } from "express";
import { getMarketItemDetail } from "../services/detail.service";
import { MarketDetailResponse } from "../interfaces/detail.interfaces";

/**
 * 마켓플레이스 상세 정보 조회
 * GET /api/market/:id
 */
export const getMarketItemDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    // 임시로 ID를 설정합니다.
    const userId = "임시 사용자 ID";

    const response = await getMarketItemDetail(id, userId);
    res.json(response);
  } catch (error: any) {
    console.error("마켓 아이템 조회 실패:", error);
    res.status(500).json({
      message: "마켓 아이템 조회 중 오류가 발생했습니다.",
    });
  }
};

export default {
  getMarketItemDetail: getMarketItemDetailController,
};
