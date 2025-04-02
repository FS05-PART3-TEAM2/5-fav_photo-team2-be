import {
  toMarketMeResponse,
  toMarketResponse,
} from "../../../utils/mappers/market.mapper";
import prisma from "../../../utils/prismaClient";
import {
  GetMarketList,
  GetMarketMeList,
  MarketCardDto,
  MarketMyCardDto,
  PhotoCardInfo,
} from "../types/market.type";

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

const getMarketMe: GetMarketMeList = async (queries, user) => {
  const { keyword, genre, grade, status, cursor, limit } = queries;
  const userId = user.id;

  const saleCards: MarketMyCardDto[] = await prisma.saleCard.findMany({
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
          sellerId: userId,
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
    toMarketMeResponse(card, Number(transactionMap.get(card.id) || 0))
  );

  const hasMore = data.length === limit;
  const nextCursor = hasMore
    ? {
        createdAt: saleCards[data.length - 1].createdAt.toISOString(),
        id: saleCards[data.length - 1].id,
      }
    : null;

  const allSaleCard = await prisma.saleCard.findMany({
    where: { sellerId: userId },
    include: {
      photoCard: true, // 관계된 PhotoCard 정보 포함
    },
  });

  const grouped = saleCards.reduce<Record<string, number>>((acc, saleCard) => {
    const grade = saleCard.photoCard.grade;
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  // 객체를 배열로 변환
  const photoCardInfo: PhotoCardInfo[] = Object.entries(grouped).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  return {
    hasMore,
    nextCursor,
    list: data,
    photoCardInfo,
  };
};

const marketService = {
  getMarketList,
  getMarketMe,
};

export default marketService;
