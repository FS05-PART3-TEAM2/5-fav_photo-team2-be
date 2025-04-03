import { Request, Response, NextFunction } from "express";
import { getBasicDetail, getExchangeDetail } from "../services/detail.service";

/**
 * 요청에서 사용자 ID를 확인하는 헬퍼 함수
 * @returns 사용자 ID 또는 undefined(인증되지 않은 경우)
 */
function getUserId(req: Request): string | undefined {
  return req.user?.id;
}

/**
 * 마켓플레이스 기본 상세 정보 조회
 * GET /api/market/:id/detail
 */
export const getBasicDetailCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`마켓 아이템 상세 정보 조회 요청: ${id}`);

    // 인증 확인
    const userId = getUserId(req);
    console.log(`요청한 사용자 ID: ${userId || "인증되지 않음"}`);

    // 인증되지 않은 경우 401 응답
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    const response = await getBasicDetail(id, userId);
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
 * 마켓플레이스 교환 제안 정보 조회
 * GET /api/market/:id/exchange
 */
export const getExchangeCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`마켓 아이템 교환 제안 정보 조회 요청: ${id}`);

    // 인증 확인
    const userId = getUserId(req);
    console.log(`요청한 사용자 ID: ${userId || "인증되지 않음"}`);

    // 인증되지 않은 경우 401 응답
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "인증이 필요합니다.",
      });
      return;
    }

    const response = await getExchangeDetail(id, userId);
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

// 라우터에서 참조하는 이름 유지
export default {
  getMarketItemBasicDetail: getBasicDetailCtrl,
  getMarketItemExchange: getExchangeCtrl,
};
