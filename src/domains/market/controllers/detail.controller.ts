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
) => {
  try {
    const { id } = req.params;

    // 인증된 사용자 정보에서 userId 가져오기
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    const userId = req.user.id;

    const response = await getMarketItemDetail(id, userId);
    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("마켓 아이템 조회 실패:", error);
    res.status(500).json({
      success: false,
      message: error.message || "마켓 아이템 조회 중 오류가 발생했습니다.",
    });
  }
};

export default {
  getMarketItemDetail: getMarketItemDetailController,
};
