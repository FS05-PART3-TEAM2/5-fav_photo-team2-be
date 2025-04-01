import { PrismaClient } from "@prisma/client";
import {
  MarketDetailResponse,
  MarketItemOffer,
} from "../interfaces/detail.interfaces";

const prisma = new PrismaClient();

/**
 * 마켓 아이템 상세 정보 조회
 *
 * @param id 판매 카드 ID
 * @param userId 현재 로그인한 사용자 ID
 * @returns 마켓 아이템 상세 정보 및 소유 정보
 */
export const getMarketItemDetail = async (
  id: string,
  userId: string
): Promise<MarketDetailResponse> => {
  // 판매 카드 정보 조회
  const saleCard = await prisma.saleCard.findUnique({
    where: { id },
  });

  if (!saleCard) {
    throw new Error(`ID가 ${id}인 판매 카드를 찾을 수 없습니다.`);
  }

  // 포토카드 정보 조회
  const photoCard = await prisma.photoCard.findUnique({
    where: { id: saleCard.photoCardId },
  });

  if (!photoCard) {
    throw new Error(
      `ID가 ${saleCard.photoCardId}인 포토카드를 찾을 수 없습니다.`
    );
  }

  // 판매자 정보 조회
  const seller = await prisma.user.findUnique({
    where: { id: saleCard.sellerId },
  });

  if (!seller) {
    throw new Error(
      `ID가 ${saleCard.sellerId}인 판매자 정보를 찾을 수 없습니다.`
    );
  }

  // 사용자가 판매자인지 여부 확인 (isMine)
  const isMine = saleCard.sellerId === userId;

  // 현재 사용자의 포토카드 소유 정보 조회
  const userPhotoCard = await prisma.userPhotoCard.findFirst({
    where: {
      photoCardId: saleCard.photoCardId,
      ownerId: userId,
    },
  });

  // 판매 카드에 대한 거래 완료 수량 계산
  const completedTransactions = await prisma.transactionLog.findMany({
    where: {
      transactionId: saleCard.id,
      transactionType: {
        in: ["PURCHASE", "EXCHANGE"],
      },
    },
  });

  // 거래 완료된 총 수량 계산
  const completedQuantity = completedTransactions.reduce(
    (sum, transaction) => sum + transaction.quantity,
    0
  );

  // 기본 응답 구성
  const response: MarketDetailResponse = {
    id: saleCard.id,
    userNickname: seller.nickname,
    imageUrl: photoCard.imageUrl,
    name: photoCard.name,
    grade: photoCard.grade,
    genre: photoCard.genre,
    description: photoCard.description,
    price: saleCard.price,
    availableAmount: saleCard.quantity - completedQuantity, // 현재 거래 가능한 수량
    totalAmount: saleCard.quantity, // 처음 등록한 총 판매 수량
    totalOwnAmount: userPhotoCard?.quantity || 0, // 사용자의 총 보유량
    createdAt: saleCard.createdAt.toISOString(),
    exchangeDetail: {
      grade: saleCard.exchangeGrade,
      genre: saleCard.exchangeGenre,
      description: saleCard.exchangeDescription,
    },
    isMine,
    receivedOffers: null,
    myOffers: null,
  };

  // 내 카드인 경우: 받은 교환 제안 조회
  if (isMine) {
    const exchangeOffers = await prisma.exchangeOffer.findMany({
      where: {
        saleCardId: id,
        status: "PENDING",
      },
    });

    // 교환 제안 상세 정보 조회
    if (exchangeOffers.length > 0) {
      const offersWithDetails: MarketItemOffer[] = await Promise.all(
        exchangeOffers.map(async (offer) => {
          const offeredCard = await prisma.photoCard.findUnique({
            where: { id: offer.offeredCardId },
          });

          const offerer = await prisma.user.findUnique({
            where: { id: offer.offererId },
          });

          if (!offeredCard || !offerer) {
            throw new Error(
              `교환 제안 정보를 찾을 수 없습니다. ID: ${offer.id}`
            );
          }

          return {
            id: offer.id,
            offererNickname: offerer.nickname,
            name: offeredCard.name,
            description: offeredCard.description,
            imageUrl: offeredCard.imageUrl,
            grade: offeredCard.grade,
            genre: offeredCard.genre,
            price: offeredCard.price,
            createdAt: offer.createdAt.toISOString(),
          };
        })
      );

      response.receivedOffers = offersWithDetails;
    } else {
      response.receivedOffers = [];
    }
  } else {
    // 다른 사람의 카드인 경우: 내가 보낸 교환 제안 조회
    const myOffers = await prisma.exchangeOffer.findMany({
      where: {
        saleCardId: id,
        offererId: userId,
        status: "PENDING",
      },
    });

    if (myOffers.length > 0) {
      const myOffersWithDetails: MarketItemOffer[] = await Promise.all(
        myOffers.map(async (offer) => {
          const offeredCard = await prisma.photoCard.findUnique({
            where: { id: offer.offeredCardId },
          });

          // 자신의 닉네임 조회
          const offerer = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (!offeredCard || !offerer) {
            throw new Error(
              `내 교환 제안 정보를 찾을 수 없습니다. ID: ${offer.id}`
            );
          }

          return {
            id: offer.id,
            offererNickname: offerer.nickname,
            name: offeredCard.name,
            description: offeredCard.description,
            imageUrl: offeredCard.imageUrl,
            grade: offeredCard.grade,
            genre: offeredCard.genre,
            price: offeredCard.price,
            createdAt: offer.createdAt.toISOString(),
          };
        })
      );

      response.myOffers = myOffersWithDetails;
    } else {
      response.myOffers = [];
    }
  }

  return response;
};
