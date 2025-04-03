import { CustomError } from "../../../utils/errors";
import prisma from "../../../utils/prismaClient";
import { CreateMarketItem } from "../types/market.type";

const createMarketItem: CreateMarketItem = async (body, userId) => {
  const { userPhotoCardId, quantity, price, exchangeOffer } = body;
  const { grade, genre, description } = exchangeOffer || {};

  const userPhotoCard = await prisma.userPhotoCard.findUnique({
    where: {
      id: userPhotoCardId,
    },
  });
  const saleCount = await prisma.saleCard.aggregate({
    where: {
      userPhotoCardId,
      sellerId: userId,
    },
    _sum: {
      quantity: true,
    },
  });

  if (!userPhotoCard || userPhotoCard.ownerId !== userId)
    throw new CustomError("Invalid user photo card", 400);
  if (userPhotoCard.quantity - (saleCount._sum.quantity || 0) < quantity)
    throw new CustomError("Not enough quantity", 400);

  const saleCard = await prisma.saleCard.create({
    data: {
      quantity,
      price,
      status: "ON_SALE",
      exchangeDescription: description || "",
      exchangeGrade: grade || "",
      exchangeGenre: genre || "",
      sellerId: userId,
      photoCardId: userPhotoCard.photoCardId,
      userPhotoCardId,
    },
    include: {
      photoCard: true,
      seller: {
        select: {
          nickname: true,
        },
      },
    },
  });

  await prisma.marketOffer.create({
    data: {
      type: "SALE",
      ownerId: userId,
      saleCardId: saleCard.id,
      exchangeOfferId: null,
    },
  });

  return {
    saleCardId: saleCard.id,
    userPhotoCardId: userPhotoCard.id,
    status: saleCard.status,
    name: saleCard.photoCard.name,
    genre: saleCard.photoCard.genre,
    grade: saleCard.photoCard.grade,
    price: saleCard.price,
    image: saleCard.photoCard.imageUrl,
    remaining: saleCard.quantity,
    total: userPhotoCard.quantity,
    createdAt: saleCard.createdAt.toISOString(),
    updatedAt: saleCard.updatedAt.toISOString(),
    owner: {
      id: userId,
      nickname: saleCard.seller.nickname,
    },
    exchangeOffer: {
      description: saleCard.exchangeDescription,
      grade: saleCard.exchangeGrade,
      genre: saleCard.exchangeGenre,
    },
  };
};

const marketCuService = {
  createMarketItem,
};

export default marketCuService;
