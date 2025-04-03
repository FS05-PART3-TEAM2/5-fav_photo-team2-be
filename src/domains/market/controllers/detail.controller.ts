import { Request, Response, NextFunction } from "express";
import {
  getMarketItemBasicDetail,
  getMarketItemExchangeDetail,
} from "../services/detail.service";

/**
 * 요청에서 사용자 ID를 추출하는 헬퍼 함수
 */
function extractUserId(req: Request, res: Response): string | null {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "인증이 필요합니다.",
    });
    return null;
  }
  return req.user.id;
}

/**
 * 마켓플레이스 기본 상세 정보 조회 (SSR용)
 * GET /api/market/:id/detail
 */
export const getMarketItemBasicDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req, res);
    if (!userId) return;

    const response = await getMarketItemBasicDetail(id, userId);
    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("마켓 아이템 기본 정보 조회 실패:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "마켓 아이템 기본 정보 조회 중 오류가 발생했습니다.",
    });
  }
};

/**
 * 마켓플레이스 교환 제안 정보 조회 (CSR용)
 * GET /api/market/:id/exchange
 */
export const getMarketItemExchangeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = extractUserId(req, res);
    if (!userId) return;

    const response = await getMarketItemExchangeDetail(id, userId);
    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("마켓 아이템 교환 제안 정보 조회 실패:", error);
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "마켓 아이템 교환 제안 정보 조회 중 오류가 발생했습니다.",
    });
  }
};

export default {
  getMarketItemBasicDetail: getMarketItemBasicDetailController,
  getMarketItemExchange: getMarketItemExchangeController,
};
