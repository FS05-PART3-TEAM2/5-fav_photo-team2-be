import { GetMarketList } from "../types/market.type";

const getMarketList: GetMarketList = async (queries) => {
  const where: any = {};

  if (queries.keyword) {
    where.$or = [
      { name: { $regex: queries.keyword, $options: "i" } },
      { description: { $regex: queries.keyword, $options: "i" } },
    ];
  }
  if (queries.grade && queries.grade !== "ALL") {
    where.grade = queries.grade;
  }
  if (queries.genre && queries.genre !== "전체") {
    where.genre = queries.genre;
  }
  if (queries.status && queries.status !== "ALL") {
    where.status = queries.status;
  }

  const sort: Record<string, 1 | -1> = { createdAt: -1 };

  if (queries.sort === "old") sort.createdAt = 1;
  if (queries.sort === "cheap") sort.price = 1;
  if (queries.sort === "expensive") sort.price = -1;

  const limit = queries.limit || 20;
  const cursor = queries.cursor;

  if (cursor) {
    where.$and = [
      ...(where.$or ? [{ $or: where.$or }] : []),
      {
        $or: [
          { createdAt: { $lt: cursor.createdAt } },
          { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
        ],
      },
    ];
    delete where.$or;
  }
};

const marketService = {
  getMarketList,
};

export default marketService;
