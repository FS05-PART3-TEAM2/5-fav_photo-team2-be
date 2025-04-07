import { CustomError } from "../../../utils/errors";
import prisma from "../../../utils/prismaClient";
import {
  CancelMarketItem,
  UpdateMarketItem,
} from "../types/market.update.types";

// 판매 등록한 포토카드 수정 (기존 판매 삭제 후 새로 등록)
const updateMarketItem: UpdateMarketItem = async (saleCardId, body, userId) => {
  const { quantity, price, exchangeOffer } = body;
  const { grade, genre, description } = exchangeOffer || {};

  // 판매 중인 카드가 존재하는지, 판매자가 본인인지 확인
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

  if (!saleCard) throw new CustomError("Sale card not found", 404);
  if (saleCard.sellerId !== userId)
    throw new CustomError("Not authorized", 403);
  if (saleCard.status !== "ON_SALE")
    throw new CustomError("Card is not on sale", 400);

  // 수정할 카드의 수량이 충분한지 확인 (수량을 수정하는 경우에만)
  if (quantity !== undefined && saleCard.userPhotoCard.quantity < quantity)
    throw new CustomError("Not enough quantity", 400);

  // === 트랜잭션으로 묶기 ===
  const result = await prisma.$transaction(async (tx) => {
    // 1. 기존 교환 제안 조회
    const existingExchangeOffers = await tx.exchangeOffer.findMany({
      where: {
        saleCardId: saleCardId,
        status: "PENDING", // 대기 중인 제안만 가져옴
      },
    });

    // 2. 기존 마켓 오퍼 조회 (교환 제안 관련 오퍼)
    const existingMarketOffers = await tx.marketOffer.findMany({
      where: {
        saleCardId: saleCardId,
        type: "EXCHANGE", // 교환 제안 타입만 가져옴
      },
    });

    // 3. 새로운 판매 카드 생성
    const newSaleCard = await tx.saleCard.create({
      data: {
        quantity: quantity !== undefined ? quantity : saleCard.quantity,
        price: price !== undefined ? price : saleCard.price,
        status: "ON_SALE",
        exchangeDescription: exchangeOffer
          ? description || ""
          : saleCard.exchangeDescription,
        exchangeGrade: exchangeOffer ? grade || "" : saleCard.exchangeGrade,
        exchangeGenre: exchangeOffer ? genre || "" : saleCard.exchangeGenre,
        sellerId: userId,
        photoCardId: saleCard.photoCardId,
        userPhotoCardId: saleCard.userPhotoCardId,
      },
      include: {
        photoCard: true,
        seller: {
          select: { nickname: true },
        },
        userPhotoCard: true,
      },
    });

    // 4. 새로운 판매 오퍼 생성
    await tx.marketOffer.create({
      data: {
        type: "SALE",
        ownerId: userId,
        saleCardId: newSaleCard.id,
        exchangeOfferId: null,
      },
    });

    // 5. 기존 교환 제안을 새 카드로 마이그레이션
    for (const offer of existingExchangeOffers) {
      await tx.exchangeOffer.update({
        where: { id: offer.id },
        data: {
          saleCardId: newSaleCard.id,
          updatedAt: new Date(),
        },
      });
    }

    // 6. 기존 마켓 오퍼의 saleCardId 업데이트
    for (const offer of existingMarketOffers) {
      await tx.marketOffer.update({
        where: { id: offer.id },
        data: {
          saleCardId: newSaleCard.id,
          updatedAt: new Date(),
        },
      });
    }

    // 7. 판매자의 마켓 오퍼 삭제 (자신의 판매 오퍼)
    await tx.marketOffer.deleteMany({
      where: {
        saleCardId,
        type: "SALE",
        ownerId: userId,
      },
    });

    // 8. 기존 판매 카드 삭제
    await tx.saleCard.delete({
      where: { id: saleCardId },
    });

    return newSaleCard;
  });

  // === 결과 리턴 ===
  return {
    saleCardId: result.id,
    userPhotoCardId: result.userPhotoCardId,
    status: result.status,
    name: result.photoCard.name,
    genre: result.photoCard.genre,
    grade: result.photoCard.grade,
    price: result.price,
    image: result.photoCard.imageUrl,
    remaining: result.quantity, // 새로운 판매 카드의 remaining은 total과 같음
    total: result.quantity, // total은 설정한 quantity와 동일하게 설정
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
    owner: {
      id: userId,
      nickname: result.seller.nickname,
    },
    exchangeOffer: {
      description: result.exchangeDescription,
      grade: result.exchangeGrade,
      genre: result.exchangeGenre,
    },
  };
};

// 판매 등록한 포토카드 취소
const cancelMarketItem: CancelMarketItem = async (saleCardId, userId) => {
  // 판매 중인 카드가 존재하는지, 판매자가 본인인지 확인
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

  if (!saleCard) throw new CustomError("Sale card not found", 404);
  if (saleCard.sellerId !== userId)
    throw new CustomError("Not authorized", 403);
  if (saleCard.status !== "ON_SALE")
    throw new CustomError("Card is not on sale", 400);

  // === 트랜잭션으로 묶기 ===
  const canceledSaleCard = await prisma.$transaction(async (tx) => {
    // 1. 모든 대기 중인 교환 제안 취소
    await tx.exchangeOffer.updateMany({
      where: {
        saleCardId: saleCardId,
        status: "PENDING",
      },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
      },
    });

    // 2. 판매 카드 취소 처리
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

    // 3. 모든 관련 마켓 오퍼 삭제
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
