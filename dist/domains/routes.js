"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const market_routes_1 = __importDefault(require("./market/market.routes"));
const notification_routes_1 = __importDefault(require("./notification/notification.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/market", market_routes_1.default);
router.use("/notifications", notification_routes_1.default);
exports.default = router;
