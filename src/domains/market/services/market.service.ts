import { toMarketResponse } from "../../../utils/mappers/market.mapper";
import prisma from "../../../utils/prismaClient";
import { GetMarketList, MarketCardDto } from "../types/market.type";

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

  console.log(JSON.stringify(saleCards, null, 2));

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
    transactions.map((t) => [t.saleCardId, t._sum.quantity || 0])
  );

  const response = saleCards.map((card) => toMarketResponse());

  return response;
};

const marketService = {
  getMarketList,
};

export default marketService;
