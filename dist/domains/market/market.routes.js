"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const market_controller_1 = __importDefault(require("./controllers/market.controller"));
const detail_controller_1 = __importDefault(require("./controllers/detail.controller"));
const requestHandler_1 = require("../../utils/requestHandler");
const validator_middleware_1 = require("../../middlewares/validator.middleware");
const market_validator_1 = require("./validators/market.validator");
const exchange_controller_1 = require("./controllers/exchange.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// 마켓 리스트 관련 라우트
router.get("/", (0, validator_middleware_1.validateAll)({ query: market_validator_1.MarketListQuerySchema }), (0, requestHandler_1.requestHandler)(market_controller_1.default.getMarketList));
router.get("/count", (0, validator_middleware_1.validateAll)({ query: market_validator_1.MarketListCountQuerySchema }), (0, requestHandler_1.requestHandler)(market_controller_1.default.getMarketListCount));
// 내 마켓 아이템 관련 라우트
router.get("/me", auth_middleware_1.authenticate, (0, validator_middleware_1.validateAll)({ query: market_validator_1.MarketMeQuerySchema }), (0, requestHandler_1.requestHandler)(market_controller_1.default.getMarketMe));
router.get("/me/count", auth_middleware_1.authenticate, (0, validator_middleware_1.validateAll)({ query: market_validator_1.MarketMeQuerySchema }), (0, requestHandler_1.requestHandler)(market_controller_1.default.getMarketMeCount));
// 마켓 상세 정보 관련 라우트
router.get("/:id/detail", auth_middleware_1.authenticate, detail_controller_1.default.getMarketItemBasicDetail);
router.get("/:id/exchange", auth_middleware_1.authenticate, detail_controller_1.default.getMarketItemExchange);
// 교환 관련 라우트
router.patch("/exchange/:id/decline", auth_middleware_1.authenticate, exchange_controller_1.declineOfferController);
exports.default = router;
