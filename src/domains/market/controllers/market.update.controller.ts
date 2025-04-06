import { Request, Response } from "express";
import marketUpdateService from "../services/market.update.services";
import {
  CancelMarketItemRequest,
  UpdateMarketItemRequest,
} from "../types/market.update.types";

// 판매 등록한 포토카드 수정
export const updateMarketItemCtrl = async (req: Request, res: Response) => {
  try {
    const { id: saleCardId } = req.params;
    console.log(`포토카드 수정 요청: ${saleCardId}`);
    console.log(`요청 본문:`, req.body);

    const body = req.body as UpdateMarketItemRequest;
    const userId = req.user!.id;
    console.log(`요청한 사용자 ID: ${userId}`);

    // 최소한 하나 이상의 필드가 제공되었는지 확인
    if (
      body.quantity === undefined &&
      body.price === undefined &&
      body.exchangeOffer === undefined
    ) {
      res.status(400).json({
        error:
          "최소한 하나 이상의 필드가 필요합니다 (quantity, price, exchangeOffer)",
      });
      return;
    }

    const result = await marketUpdateService.updateMarketItem(
      saleCardId,
      body,
      userId
    );

    console.log(`포토카드 수정 성공: ${saleCardId}`);
    res.status(201).json(result);
  } catch (error: any) {
    console.error(`포토카드 수정 실패:`, error);
    res.status(error.statusCode || 500).json({
      error: error.message || "포토카드 수정 중 오류가 발생했습니다.",
    });
  }
};

// 판매 등록한 포토카드 취소
export const cancelMarketItemCtrl = async (req: Request, res: Response) => {
  try {
    const body = req.body as CancelMarketItemRequest;
    const userId = req.user!.id;
    console.log(`포토카드 판매 취소 요청: ${body.saleCardId}`);
    console.log(`요청한 사용자 ID: ${userId}`);

    const result = await marketUpdateService.cancelMarketItem(body, userId);

    console.log(`포토카드 판매 취소 성공: ${body.saleCardId}`);
    res.status(201).json(result);
  } catch (error: any) {
    console.error(`포토카드 판매 취소 실패:`, error);
    res.status(error.statusCode || 500).json({
      error: error.message || "포토카드 판매 취소 중 오류가 발생했습니다.",
    });
  }
};

export default {
  updateMarketItemCtrl,
  cancelMarketItemCtrl,
};
