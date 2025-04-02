"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineOfferController = void 0;
const exchange_service_1 = require("../services/exchange.service");
const declineOfferController = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await (0, exchange_service_1.declineOffer)(id);
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Exchange decline error:", error);
        res.status(500).json({ error: "Failed to decline exchange offer" });
    }
};
exports.declineOfferController = declineOfferController;
