"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const market_mapper_1 = require("../../../utils/mappers/market.mapper");
const prismaClient_1 = __importDefault(require("../../../utils/prismaClient"));
const enums_type_1 = require("../../../types/enums.type");
/**
 *
 * @param queries
 * @returns
 */
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
    // console.log(data);
    /* */
    let gradeResult = (await prismaClient_1.default.$queryRaw `
  SELECT "photoCard"."grade", COUNT(*)
  FROM "SaleCard" AS "saleCard"
  JOIN "PhotoCard" AS "photoCard" ON "saleCard"."photoCardId" = "photoCard"."id"
  GROUP BY "photoCard"."grade"
`);
    const gradeMap = new Map(gradeResult.map((r) => [r.grade, Number(r.count)]));
    const gradeInfo = enums_type_1.allGrades.map((genre) => ({
        name: genre,
        count: gradeMap.get(genre) || 0,
    }));
    /* */
    const genreResult = (await prismaClient_1.default.$queryRaw `
    SELECT "photoCard"."genre", COUNT(*)
    FROM "SaleCard" AS "saleCard"
    JOIN "PhotoCard" AS "photoCard" ON "saleCard"."photoCardId" = "photoCard"."id"
    GROUP BY "photoCard"."genre"
  `);
    const resultMap = new Map(genreResult.map((r) => [r.genre, Number(r.count)]));
    const genreInfo = enums_type_1.allGenres.map((genre) => ({
        name: genre,
        count: resultMap.get(genre) || 0,
    }));
    /* */
    let statusResult = await prismaClient_1.default.saleCard.groupBy({
        by: ["status"],
        _count: {
            _all: true,
        },
    });
    const statusMap = new Map(statusResult.map((r) => [r.status, r._count._all]));
    const statusInfo = enums_type_1.allSaleStatus.map((status) => ({
        name: status,
        count: statusMap.get(status) || 0,
    }));
    /* */
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
        info: {
            grade: gradeInfo,
            genre: genreInfo,
            status: statusInfo,
        },
    };
};
const getMarketMe = async (queries, user) => {
    const { keyword, genre, grade, status, cursor, limit } = queries;
    const userId = user.id;
    const marketOffers = await prismaClient_1.default.marketOffer.findMany({
        take: limit,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: {
            saleCard: { include: { photoCard: { include: { creator: true } } } },
            exchangeOffer: {
                include: {
                    saleCard: { include: { photoCard: { include: { creator: true } } } },
                },
            },
        },
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
                    ownerId: userId,
                },
            ],
            OR: [
                {
                    type: "SALE",
                    saleCard: {
                        photoCard: {
                            AND: [
                                keyword
                                    ? {
                                        OR: [
                                            { name: { contains: keyword } },
                                            { description: { contains: keyword } },
                                        ],
                                    }
                                    : {},
                                genre ? { genre: genre } : {},
                                grade ? { grade: grade } : {},
                            ],
                        },
                    },
                },
                {
                    type: "EXCHANGE",
                    exchangeOffer: {
                        saleCard: {
                            photoCard: {
                                AND: [
                                    keyword
                                        ? {
                                            OR: [
                                                { name: { contains: keyword } },
                                                { description: { contains: keyword } },
                                            ],
                                        }
                                        : {},
                                    genre ? { genre: genre } : {},
                                    grade ? { grade: grade } : {},
                                ],
                            },
                        },
                    },
                },
            ],
        },
    });
    // console.log(JSON.stringify(marketOffers, null, 2));
    const saleCardIds = marketOffers
        .filter((offer) => offer.type === "SALE" && offer.saleCardId) // null 제거
        .map((offer) => offer.saleCardId); // 타입 확정
    const quantities = await prismaClient_1.default.transactionLog.groupBy({
        by: ["saleCardId"],
        where: { saleCardId: { in: saleCardIds } },
        _sum: { quantity: true },
    });
    const quantityMap = Object.fromEntries(quantities.map((q) => [q.saleCardId, q._sum?.quantity ?? 0]));
    const enrichedOffers = marketOffers.map((offer) => {
        if (offer.type === "SALE") {
            return {
                ...offer,
                totalTradedQuantity: offer.saleCardId
                    ? quantityMap[offer.saleCardId] || 0
                    : 0,
            };
        }
        return offer;
    });
    // console.log(JSON.stringify(enrichedOffers, null, 2));
    const data = enrichedOffers.map((card) => (0, market_mapper_1.toMarketMeResponse)(card));
    const hasMore = data.length === limit;
    const nextCursor = hasMore
        ? {
            createdAt: marketOffers[data.length - 1].createdAt.toISOString(),
            id: marketOffers[data.length - 1].id,
        }
        : null;
    /* */
    const marketOffersTmp = await prismaClient_1.default.marketOffer.findMany({
        where: { ownerId: userId },
        select: {
            type: true,
            saleCard: {
                select: {
                    photoCard: {
                        select: {
                            grade: true,
                            genre: true,
                        },
                    },
                    status: true,
                },
            },
            exchangeOffer: {
                select: {
                    saleCard: {
                        select: {
                            photoCard: {
                                select: {
                                    grade: true,
                                    genre: true,
                                },
                            },
                            status: true,
                        },
                    },
                    status: true,
                },
            },
        },
    });
    // gradeInfo
    const gradeInfo = enums_type_1.allGrades.map((grade) => {
        const count = marketOffersTmp.filter((offer) => (offer.type === "SALE" && offer.saleCard?.photoCard?.grade === grade) ||
            (offer.type === "EXCHANGE" &&
                offer.exchangeOffer?.saleCard?.photoCard?.grade === grade)).length;
        return { name: grade, count };
    });
    // genreInfo
    const genreInfo = enums_type_1.allGenres.map((genre) => {
        const count = marketOffersTmp.filter((offer) => (offer.type === "SALE" && offer.saleCard?.photoCard?.genre === genre) ||
            (offer.type === "EXCHANGE" &&
                offer.exchangeOffer?.saleCard?.photoCard?.genre === genre)).length;
        return { name: genre, count };
    });
    // statusInfo
    const statusInfo = enums_type_1.allMarketStatus.map((status) => {
        const count = marketOffersTmp.filter((offer) => (status === "PENDING" &&
            offer.type === "EXCHANGE" &&
            offer.exchangeOffer?.status === status) ||
            (status !== "PENDING" &&
                offer.type === "SALE" &&
                offer.saleCard?.status === status)).length;
        return { name: status, count };
    });
    return {
        hasMore,
        nextCursor,
        list: data,
        info: {
            grade: gradeInfo,
            genre: genreInfo,
            status: statusInfo,
        },
    };
};
/**
 *
 * @param queries
 * @returns
 */
const getMarketListCount = async (queries) => {
    const { genre, grade, status } = queries;
    const count = await prismaClient_1.default.saleCard.count({
        where: {
            ...(status && { status: status }),
            photoCard: {
                ...(grade && { grade: grade }),
                ...(genre && { genre: genre }),
            },
        },
    });
    return {
        grade: grade || "ALL",
        genre: genre || "ALL",
        status: status || "ALL",
        count,
    };
};
/**
 *
 * @param queries
 * @param userId
 * @returns
 */
const getMarketMeCount = async (queries, userId) => {
    const { genre, grade, status } = queries;
    const isExchange = status === "PENDING";
    const isSale = status === "ON_SALE" || status === "SOLD_OUT";
    let where = {
        ownerId: userId,
    };
    if (!status) {
        // status 없을 때 (모두 사용)
        where = {
            ownerId: userId,
            OR: [
                {
                    type: "SALE",
                    saleCard: {
                        photoCard: {
                            ...(grade ? { grade } : {}),
                            ...(genre ? { genre } : {}),
                        },
                    },
                },
                {
                    type: "EXCHANGE",
                    exchangeOffer: {
                        saleCard: {
                            photoCard: {
                                ...(grade ? { grade } : {}),
                                ...(genre ? { genre } : {}),
                            },
                        },
                    },
                },
            ],
        };
    }
    else if (isSale) {
        // ON_SALE | SOLD_OUT
        where = {
            ownerId: userId,
            type: "SALE",
            saleCard: {
                status,
                photoCard: {
                    ...(grade ? { grade } : {}),
                    ...(genre ? { genre } : {}),
                },
            },
        };
    }
    else if (isExchange) {
        // PENDING
        where = {
            ownerId: userId,
            type: "EXCHANGE",
            exchangeOffer: {
                status: "PENDING",
                saleCard: {
                    photoCard: {
                        ...(grade ? { grade } : {}),
                        ...(genre ? { genre } : {}),
                    },
                },
            },
        };
    }
    const count = await prismaClient_1.default.marketOffer.count({ where });
    return {
        grade: grade || "ALL",
        genre: genre || "ALL",
        status: status || "ALL",
        count,
    };
};
const marketService = {
    getMarketList,
    getMarketMe,
    getMarketListCount,
    getMarketMeCount,
};
exports.default = marketService;
