"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeCtrl = exports.getBasicDetailCtrl = void 0;
const detail_service_1 = require("../services/detail.service");
/**
 * 요청에서 사용자 ID를 확인하는 헬퍼 함수
 * @returns 사용자 ID 또는 undefined(인증되지 않은 경우)
 */
function getUserId(req) {
    return req.user?.id;
}
/**
 * 마켓플레이스 기본 상세 정보 조회
 * GET /api/market/:id/detail
 */
const getBasicDetailCtrl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = getUserId(req);
        // 인증되지 않은 경우 401 응답
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "인증이 필요합니다.",
            });
            return;
        }
        const response = await (0, detail_service_1.getBasicDetail)(id, userId);
        res.json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error("마켓 아이템 기본 정보 조회 실패:", error);
        res.status(500).json({
            success: false,
            message: error.message || "마켓 아이템 기본 정보 조회 중 오류가 발생했습니다.",
        });
    }
};
exports.getBasicDetailCtrl = getBasicDetailCtrl;
/**
 * 마켓플레이스 교환 제안 정보 조회
 * GET /api/market/:id/exchange
 */
const getExchangeCtrl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = getUserId(req);
        // 인증되지 않은 경우 401 응답
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "인증이 필요합니다.",
            });
            return;
        }
        const response = await (0, detail_service_1.getExchangeDetail)(id, userId);
        res.json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error("마켓 아이템 교환 제안 정보 조회 실패:", error);
        res.status(500).json({
            success: false,
            message: error.message ||
                "마켓 아이템 교환 제안 정보 조회 중 오류가 발생했습니다.",
        });
    }
};
exports.getExchangeCtrl = getExchangeCtrl;
// 라우터에서 참조하는 이름 유지
exports.default = {
    getMarketItemBasicDetail: exports.getBasicDetailCtrl,
    getMarketItemExchange: exports.getExchangeCtrl,
};
