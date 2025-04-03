import {
  toMarketMeResponse,
  toMarketResponse,
} from "../../../utils/mappers/market.mapper";
import prisma from "../../../utils/prismaClient";
import {
  GetMarketList,
  GetMarketListCount,
  GetMarketMeList,
  MarketCardDto,
  PhotoCardInfo,
} from "../types/market.type";
import { MarketOfferDto } from "../../../types/dtos/marketOffer.dto";
import { allGenres, allGrades, allSaleStatus } from "../../../types/enums.type";

/**
 *
 * @param queries
 * @returns
 */
const getMarketList: GetMarketList = async (queries) => {
  const { keyword, genre, grade, cursor, limit } = queries;

  const saleCards: MarketCardDto[] = await prisma.saleCard.findMany({
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

  const transactions = await prisma.transactionLog.groupBy({
    by: ["saleCardId"],
    where: {
      saleCardId: { in: saleCardIds },
    },
    _sum: {
      quantity: true,
    },
  });

  const transactionMap = new Map(
    transactions.map(
      (t: { saleCardId: string; _sum: { quantity: number | null } }) => [
        t.saleCardId,
        t._sum.quantity || 0,
      ]
    )
  );

  const data = saleCards.map((card) =>
    toMarketResponse(card, Number(transactionMap.get(card.id) || 0))
  );

  // console.log(data);

  /* */
  let gradeResult = (await prisma.$queryRaw`
  SELECT "photoCard"."grade", COUNT(*)
  FROM "SaleCard" AS "saleCard"
  JOIN "PhotoCard" AS "photoCard" ON "saleCard"."photoCardId" = "photoCard"."id"
  GROUP BY "photoCard"."grade"
`) as { grade: string; count: number }[];
  const gradeMap = new Map(gradeResult.map((r) => [r.grade, Number(r.count)]));
  const gradeInfo: PhotoCardInfo[] = allGrades.map((genre) => ({
    name: genre,
    count: gradeMap.get(genre) || 0,
  }));

  /* */
  const genreResult = (await prisma.$queryRaw`
    SELECT "photoCard"."genre", COUNT(*)
    FROM "SaleCard" AS "saleCard"
    JOIN "PhotoCard" AS "photoCard" ON "saleCard"."photoCardId" = "photoCard"."id"
    GROUP BY "photoCard"."genre"
  `) as { genre: string; count: number }[];
  const resultMap = new Map(genreResult.map((r) => [r.genre, Number(r.count)]));
  const genreInfo: PhotoCardInfo[] = allGenres.map((genre) => ({
    name: genre,
    count: resultMap.get(genre) || 0,
  }));

  /* */
  let statusResult = await prisma.saleCard.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });
  const statusMap = new Map(statusResult.map((r) => [r.status, r._count._all]));
  const statusInfo: PhotoCardInfo[] = allSaleStatus.map((status) => ({
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

const getMarketMe: GetMarketMeList = async (queries, user) => {
  const { keyword, genre, grade, status, cursor, limit } = queries;
  const userId = user.id;

  const marketOffers: MarketOfferDto[] = await prisma.marketOffer.findMany({
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
    .map((offer) => offer.saleCardId as string); // 타입 확정

  const quantities = await prisma.transactionLog.groupBy({
    by: ["saleCardId"],
    where: { saleCardId: { in: saleCardIds } },
    _sum: { quantity: true },
  });

  const quantityMap = Object.fromEntries(
    quantities.map((q) => [q.saleCardId, q._sum?.quantity ?? 0])
  );

  const enrichedOffers: MarketOfferDto[] = marketOffers.map((offer) => {
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

  const data = enrichedOffers.map((card) => toMarketMeResponse(card));

  const hasMore = data.length === limit;
  const nextCursor = hasMore
    ? {
        createdAt: marketOffers[data.length - 1].createdAt.toISOString(),
        id: marketOffers[data.length - 1].id,
      }
    : null;

  const saleCards = await prisma.saleCard.findMany({
    where: {
      sellerId: userId,
      status: {
        in: ["ON_SALE", "SOLD_OUT"],
      },
    },
    include: {
      photoCard: true, // 관계된 PhotoCard 정보 포함
    },
  });
  const exchangeCards = await prisma.exchangeOffer.findMany({
    where: {
      offererId: userId,
      status: {
        in: ["PENDING"],
      },
    },
    include: {
      saleCard: {
        include: {
          photoCard: true,
        },
      },
    },
  });

  // 판매카드와 교환카드의 포토카드 묶기
  const allPhotoCards = [
    ...saleCards.map((card) => card.photoCard),
    ...exchangeCards.map((offer) => offer.saleCard.photoCard),
  ];

  // 등급별 그룹화
  const grouped = allPhotoCards.reduce<Record<string, number>>(
    (acc, photoCard) => {
      const grade = photoCard.grade;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    },
    {}
  );

  // 배열 형태로 변환
  const photoCardInfo = Object.entries(grouped).map(([name, count]) => ({
    name,
    count,
  }));

  // /* */
  // let gradeResult = (await prisma.$queryRaw`
  //     SELECT "photoCard"."grade", COUNT(*)
  //     FROM "SaleCard" AS "saleCard"
  //     JOIN "PhotoCard" AS "photoCard" ON "saleCard"."photoCardId" = "photoCard"."id"
  //     WHERE "saleCard"."sellerId" = ${userId}
  //     GROUP BY "photoCard"."grade"
  //   `) as { grade: string; count: number }[];
  // const gradeMap = new Map(gradeResult.map((r) => [r.grade, Number(r.count)]));
  // const gradeInfo: PhotoCardInfo[] = allGrades.map((genre) => ({
  //   name: genre,
  //   count: gradeMap.get(genre) || 0,
  // }));

  // /* */
  // const genreResult = (await prisma.$queryRaw`
  //       SELECT "photoCard"."genre", COUNT(*)
  //       FROM "SaleCard" AS "saleCard"
  //       JOIN "PhotoCard" AS "photoCard" ON "saleCard"."photoCardId" = "photoCard"."id"
  //       GROUP BY "photoCard"."genre"
  //     `) as { genre: string; count: number }[];
  // const resultMap = new Map(genreResult.map((r) => [r.genre, Number(r.count)]));
  // const genreInfo: PhotoCardInfo[] = allGenres.map((genre) => ({
  //   name: genre,
  //   count: resultMap.get(genre) || 0,
  // }));

  // /* */
  // let statusResult = await prisma.saleCard.groupBy({
  //   by: ["status"],
  //   _count: {
  //     _all: true,
  //   },
  // });
  // const statusMap = new Map(statusResult.map((r) => [r.status, r._count._all]));
  // const statusInfo: PhotoCardInfo[] = allSaleStatus.map((status) => ({
  //   name: status,
  //   count: statusMap.get(status) || 0,
  // }));

  return {
    hasMore,
    nextCursor,
    list: data,
    photoCardInfo,
  };
};

const getMarketListCount: GetMarketListCount = async (queries) => {
  const { genre, grade, status } = queries;

  const count = await prisma.saleCard.count({
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

const marketService = {
  getMarketList,
  getMarketMe,
  getMarketListCount,
};

export default marketService;
