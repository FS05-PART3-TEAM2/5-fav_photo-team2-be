"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineOffer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const declineOffer = async (id) => {
    return prisma.exchangeOffer.update({
        where: { id },
        data: { status: "declined" },
    });
};
exports.declineOffer = declineOffer;
