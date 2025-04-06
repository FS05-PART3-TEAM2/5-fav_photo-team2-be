import { CustomError } from "../../../utils/errors";
import prisma from "../../../utils/prismaClient";
import {
  CancelMarketItem,
  UpdateMarketItem,
} from "../types/market.update.types";

// 판매 등록한 포토카드 수정
const updateMarketItem: UpdateMarketItem = async (saleCardId, body, userId) => {
  const { quantity, price, exchangeOffer } = body;
  const { grade, genre, description } = exchangeOffer || {};

  // 판매 중인 카드가 존재하는지, 판매자가 본인인지 확인
  console.log(`서비스에서 검색하는 카드 ID: ${saleCardId}`);
  const saleCard = await prisma.saleCard.findUnique({
    where: { id: saleCardId },
    include: {
      photoCard: true,
      seller: {
        select: { nickname: true },
      },
      userPhotoCard: true,
    },
  });
  console.log(`검색 결과: ${saleCard ? "카드 찾음" : "카드 찾지 못함"}`);

  if (!saleCard) throw new CustomError("Sale card not found", 404);
  if (saleCard.sellerId !== userId)
    throw new CustomError("Not authorized", 403);
  if (saleCard.status !== "ON_SALE")
    throw new CustomError("Card is not on sale", 400);

  // 수정할 카드의 수량이 충분한지 확인 (수량을 수정하는 경우에만)
  if (quantity !== undefined && saleCard.userPhotoCard.quantity < quantity)
    throw new CustomError("Not enough quantity", 400);

  // 업데이트할 데이터 객체 생성
  const updateData: any = {
    updatedAt: new Date(),
  };

  // 제공된 필드만 업데이트 데이터에 추가
  if (quantity !== undefined) {
    updateData.quantity = quantity;
  }

  if (price !== undefined) {
    updateData.price = price;
  }

  if (exchangeOffer !== undefined) {
    updateData.exchangeDescription = description || "";
    updateData.exchangeGrade = grade || "";
    updateData.exchangeGenre = genre || "";
  }

  // === 트랜잭션으로 묶기 ===
  const updatedSaleCard = await prisma.$transaction(async (tx) => {
    const updatedSaleCard = await tx.saleCard.update({
      where: { id: saleCardId },
      data: updateData,
      include: {
        photoCard: true,
        seller: {
          select: { nickname: true },
        },
        userPhotoCard: true,
      },
    });

    return updatedSaleCard;
  });

  // === 결과 리턴 ===
  return {
    saleCardId: updatedSaleCard.id,
    userPhotoCardId: updatedSaleCard.userPhotoCardId,
    status: updatedSaleCard.status,
    name: updatedSaleCard.photoCard.name,
    genre: updatedSaleCard.photoCard.genre,
    grade: updatedSaleCard.photoCard.grade,
    price: updatedSaleCard.price,
    image: updatedSaleCard.photoCard.imageUrl,
    remaining: updatedSaleCard.quantity,
    total: updatedSaleCard.userPhotoCard.quantity,
    createdAt: updatedSaleCard.createdAt.toISOString(),
    updatedAt: updatedSaleCard.updatedAt.toISOString(),
    owner: {
      id: userId,
      nickname: updatedSaleCard.seller.nickname,
    },
    exchangeOffer: {
      description: updatedSaleCard.exchangeDescription,
      grade: updatedSaleCard.exchangeGrade,
      genre: updatedSaleCard.exchangeGenre,
    },
  };
};

// 판매 등록한 포토카드 취소
const cancelMarketItem: CancelMarketItem = async (body, userId) => {
  const { saleCardId } = body;

  // 판매 중인 카드가 존재하는지, 판매자가 본인인지 확인
  console.log(`서비스에서 검색하는 카드 ID: ${saleCardId}`);
  const saleCard = await prisma.saleCard.findUnique({
    where: { id: saleCardId },
    include: {
      photoCard: true,
      seller: {
        select: { nickname: true },
      },
      userPhotoCard: true,
    },
  });
  console.log(`검색 결과: ${saleCard ? "카드 찾음" : "카드 찾지 못함"}`);

  if (!saleCard) throw new CustomError("Sale card not found", 404);
  if (saleCard.sellerId !== userId)
    throw new CustomError("Not authorized", 403);
  if (saleCard.status !== "ON_SALE")
    throw new CustomError("Card is not on sale", 400);

  // === 트랜잭션으로 묶기 ===
  const canceledSaleCard = await prisma.$transaction(async (tx) => {
    const canceledSaleCard = await tx.saleCard.update({
      where: { id: saleCardId },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
      },
      include: {
        photoCard: true,
        seller: {
          select: { nickname: true },
        },
        userPhotoCard: true,
      },
    });

    // 관련 MarketOffer 삭제
    await tx.marketOffer.deleteMany({
      where: { saleCardId },
    });

    return canceledSaleCard;
  });

  // === 결과 리턴 ===
  return {
    saleCardId: canceledSaleCard.id,
    userPhotoCardId: canceledSaleCard.userPhotoCardId,
    status: canceledSaleCard.status,
    name: canceledSaleCard.photoCard.name,
    genre: canceledSaleCard.photoCard.genre,
    grade: canceledSaleCard.photoCard.grade,
    price: canceledSaleCard.price,
    image: canceledSaleCard.photoCard.imageUrl,
    remaining: canceledSaleCard.quantity,
    total: canceledSaleCard.userPhotoCard.quantity,
    createdAt: canceledSaleCard.createdAt.toISOString(),
    updatedAt: canceledSaleCard.updatedAt.toISOString(),
    owner: {
      id: userId,
      nickname: canceledSaleCard.seller.nickname,
    },
    exchangeOffer: {
      description: canceledSaleCard.exchangeDescription,
      grade: canceledSaleCard.exchangeGrade,
      genre: canceledSaleCard.exchangeGenre,
    },
  };
};

const marketUpdateService = {
  updateMarketItem,
  cancelMarketItem,
};

export default marketUpdateService;
