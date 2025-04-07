import { CustomError } from "../../../utils/errors";
import prisma from "../../../utils/prismaClient";
import { createNotification } from "../../notification/services/notificationService";
import { CreateMarketItem } from "../types/market.type";

const createMarketItem: CreateMarketItem = async (body, userId) => {
  const { userPhotoCardId, quantity, price, exchangeOffer } = body;
  const { grade, genre, description } = exchangeOffer || {};

  // 판매할 카드가 존재하는지 확인
  const userPhotoCard = await prisma.userPhotoCard.findUnique({
    where: { id: userPhotoCardId },
  });
  if (!userPhotoCard || userPhotoCard.ownerId !== userId)
    throw new CustomError("Invalid user photo card", 400);

  // 이미 판매중인 카드인지 확인
  const onSaleCard = await prisma.saleCard.findFirst({
    where: { userPhotoCardId, status: "ON_SALE" },
  });
  if (onSaleCard) throw new CustomError("Already on sale", 400);

  // 판매할 카드의 수량이 충분한지 확인
  if (userPhotoCard.quantity < quantity)
    throw new CustomError("Not enough quantity", 400);

  // === 트랜잭션으로 묶기 ===
  const saleCard = await prisma.$transaction(async (tx) => {
    const saleCard = await tx.saleCard.create({
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
          select: { nickname: true },
        },
      },
    });

    await tx.marketOffer.create({
      data: {
        type: "SALE",
        ownerId: userId,
        saleCardId: saleCard.id,
        exchangeOfferId: null,
      },
    });

    return saleCard;
  });

  // === 결과 리턴 ===
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
