"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const market_service_1 = __importDefault(require("../services/market.service"));
const getMarketList = async (req, res) => {
    const queries = req.query;
    const response = await market_service_1.default.getMarketList(queries);
    res.status(200).send(response);
};
const marketController = {
    getMarketList,
};
exports.default = marketController;
