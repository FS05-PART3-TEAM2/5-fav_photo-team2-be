import { CustomError } from "../../../utils/errors";
import prisma from "../../../utils/prismaClient";
import {
  CancelMarketItem,
  MarketItemResponse,
  UpdateMarketItem,
} from "../types/market.update.types";

// 응답 객체 생성을 위한 공통 함수
const createResponseObject = (
  saleCard: any,
  userId: string
): MarketItemResponse => {
  return {
    saleCardId: saleCard.id,
    userPhotoCardId: saleCard.userPhotoCardId,
    status: saleCard.status,
    name: saleCard.photoCard.name,
    genre: saleCard.photoCard.genre,
    grade: saleCard.photoCard.grade,
    price: saleCard.price,
    image: saleCard.photoCard.imageUrl,
    remaining: saleCard.quantity,
    total: saleCard.quantity,
    createdAt: saleCard.createdAt.toISOString(),
    updatedAt: saleCard.updatedAt.toISOString(),
    creator: {
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

// 판매 중인 카드의 유효성 검증을 위한 공통 함수
const validateSaleCard = async (saleCardId: string, userId: string) => {
  const saleCard = await prisma.saleCard.findUnique({
    where: { id: saleCardId },
    include: {
      photoCard: true,
      seller: { select: { nickname: true } },
      userPhotoCard: true,
    },
  });

  if (!saleCard) throw new CustomError("Sale card not found", 404);
  if (saleCard.sellerId !== userId)
    throw new CustomError("Not authorized", 403);
  if (saleCard.status !== "ON_SALE")
    throw new CustomError("Card is not on sale", 400);

  return saleCard;
};

// 판매 등록한 포토카드 수정 (기존 판매 취소 후 새로 등록)
const updateMarketItem: UpdateMarketItem = async (saleCardId, body, userId) => {
  const { quantity, price, exchangeOffer } = body;
  const { grade, genre, description } = exchangeOffer || {};

  // 판매 중인 카드 검증
  const saleCard = await validateSaleCard(saleCardId, userId);

  // 수정할 카드의 수량이 충분한지 확인
  if (quantity !== undefined && saleCard.userPhotoCard.quantity < quantity)
    throw new CustomError("Not enough quantity", 400);

  // 기존 교환 제안 조회
  const pendingOffers = await prisma.exchangeOffer.findMany({
    where: {
      saleCardId,
      status: "PENDING",
    },
    include: {
      marketOffer: true,
    },
  });

  // 트랜잭션으로 모든 작업 처리
  const result = await prisma.$transaction(async (tx) => {
    // 1. 새로운 판매 카드 생성
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
        seller: { select: { nickname: true } },
        userPhotoCard: true,
      },
    });

    // 2. 새로운 판매 오퍼 생성
    await tx.marketOffer.create({
      data: {
        type: "SALE",
        ownerId: userId,
        saleCardId: newSaleCard.id,
        exchangeOfferId: null,
      },
    });

    // 3. 기존 판매 카드 상태 변경
    await tx.saleCard.update({
      where: { id: saleCardId },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
      },
    });

    // 4. 판매자의 기존 마켓 오퍼 삭제
    await tx.marketOffer.deleteMany({
      where: {
        saleCardId,
        type: "SALE",
        ownerId: userId,
      },
    });

    // 5. 교환 제안 마이그레이션
    for (const offer of pendingOffers) {
      try {
        // 5.1 새 교환 제안 생성
        const newOffer = await tx.exchangeOffer.create({
          data: {
            offererId: offer.offererId,
            userPhotoCardId: offer.userPhotoCardId,
            content: offer.content,
            saleCardId: newSaleCard.id,
            status: "PENDING",
          },
        });

        // 5.2 기존 교환 제안 상태 변경
        await tx.exchangeOffer.update({
          where: { id: offer.id },
          data: {
            status: "CANCELED",
            updatedAt: new Date(),
          },
        });

        // 5.3 기존 마켓 오퍼가 있으면 삭제
        if (offer.marketOffer) {
          await tx.marketOffer.delete({
            where: { id: offer.marketOffer.id },
          });
        }

        // 5.4 새 마켓 오퍼 생성
        await tx.marketOffer.create({
          data: {
            type: "EXCHANGE",
            ownerId: offer.offererId,
            saleCardId: null,
            exchangeOfferId: newOffer.id,
          },
        });
      } catch (error) {
        console.error(`교환 제안 마이그레이션 실패 (${offer.id}):`, error);
        throw error; // 트랜잭션을 롤백시키기 위해 에러를 다시 던짐
      }
    }

    return newSaleCard;
  });

  return createResponseObject(result, userId);
};

// 판매 등록한 포토카드 취소
const cancelMarketItem: CancelMarketItem = async (saleCardId, userId) => {
  // 판매 중인 카드 검증
  const saleCard = await validateSaleCard(saleCardId, userId);

  // 트랜잭션으로 모든 작업 처리
  const canceledSaleCard = await prisma.$transaction(async (tx) => {
    // 교환 제안 ID 목록 조회
    const exchangeOffers = await tx.exchangeOffer.findMany({
      where: {
        saleCardId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    });

    const exchangeOfferIds = exchangeOffers.map((offer) => offer.id);

    // 교환 제안 관련 마켓 오퍼 삭제
    if (exchangeOfferIds.length > 0) {
      await tx.marketOffer.deleteMany({
        where: {
          exchangeOfferId: {
            in: exchangeOfferIds,
          },
        },
      });
    }

    // 대기 중인 교환 제안 취소
    await tx.exchangeOffer.updateMany({
      where: {
        saleCardId,
        status: "PENDING",
      },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
      },
    });

    // 판매 카드 취소 처리
    const canceledCard = await tx.saleCard.update({
      where: { id: saleCardId },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
      },
      include: {
        photoCard: true,
        seller: { select: { nickname: true } },
        userPhotoCard: true,
      },
    });

    // 판매 관련 마켓 오퍼 삭제
    await tx.marketOffer.deleteMany({
      where: { saleCardId },
    });

    return canceledCard;
  });

  // 응답 객체 생성 (취소된 카드는 remaining과 total이 다를 수 있음)
  const response = createResponseObject(canceledSaleCard, userId);
  response.total = canceledSaleCard.userPhotoCard.quantity;

  return response;
};

const marketUpdateService = {
  updateMarketItem,
  cancelMarketItem,
};

export default marketUpdateService;
