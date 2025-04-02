"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const market_mapper_1 = require("../../../utils/mappers/market.mapper");
const prismaClient_1 = __importDefault(require("../../../utils/prismaClient"));
const getMarketList = async (queries) => {
    const { keyword, genre, grade, cursor, limit } = queries;
    const saleCards = await prismaClient_1.default.saleCard.findMany({
        where: {
            AND: [
                cursor
                    ? {
                        OR: [
                            { createdAt: { lt: new Date(cursor.createdAt) } },
                            {
                                createdAt: { equals: new Date(cursor.createdAt) },
                                id: { lt: cursor.id },
                            },
                        ],
                    }
                    : {},
                {
                    photoCard: {
                        AND: [
                            keyword
                                ? {
                                    OR: [
                                        { name: { contains: keyword, mode: "insensitive" } },
                                        {
                                            description: { contains: keyword, mode: "insensitive" },
                                        },
                                    ],
                                }
                                : {},
                            genre ? { genre } : {},
                            grade ? { grade } : {},
                        ],
                    },
                },
            ],
        },
        include: {
            seller: { select: { id: true, nickname: true } },
            userPhotoCard: { select: { quantity: true } },
            photoCard: {
                select: {
                    creator: { select: { id: true, nickname: true } },
                    name: true,
                    genre: true,
                    grade: true,
                    description: true,
                    imageUrl: true,
                },
            },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: limit,
    });
    // console.log(JSON.stringify(saleCards, null, 2));
    const saleCardIds = saleCards.map((card) => card.id);
    const transactions = await prismaClient_1.default.transactionLog.groupBy({
        by: ["saleCardId"],
        where: {
            saleCardId: { in: saleCardIds },
        },
        _sum: {
            quantity: true,
        },
    });
    const transactionMap = new Map(transactions.map((t) => [
        t.saleCardId,
        t._sum.quantity || 0,
    ]));
    const data = saleCards.map((card) => (0, market_mapper_1.toMarketResponse)(card, Number(transactionMap.get(card.id) || 0)));
    console.log(data);
    const hasMore = data.length === limit;
    const nextCursor = hasMore
        ? {
            createdAt: saleCards[data.length - 1].createdAt.toISOString(),
            id: saleCards[data.length - 1].id,
        }
        : null;
    return {
        hasMore,
        nextCursor,
        list: data,
    };
};
const marketService = {
    getMarketList,
};
exports.default = marketService;
