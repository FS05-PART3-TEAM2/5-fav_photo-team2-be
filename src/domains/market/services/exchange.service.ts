import { PrismaClient } from "@prisma/client";
import { ExchangeOffer } from "../interfaces/exchange.interface";

const prisma = new PrismaClient();

/**
 * 교환제안 취소/거절
 * @param id 교환제안 ID
 * @returns 취소/거절된 교환제안
 */
export const declineOffer = async (id: string): Promise<ExchangeOffer> => {
  const result = await prisma.exchangeOffer.update({
    where: { id },
    data: { status: "DECLINED" },
  });
  return result as unknown as ExchangeOffer;
};

/**
 * 교환제안 승인
 *
 * @param id 교환제안 ID
 * @returns 승인된 교환제안
 *
 * seller : 판매 카드 소유자
 * offerer : 교환 제안자
 * seller -> offerer : 판매 카드 제공
 * offerer -> seller : 교환 카드 제공
 */
export const acceptOffer = async (id: string): Promise<ExchangeOffer> => {
  return prisma.$transaction(async (tx) => {
    // 1. 교환제안 조회
    const exchangeOffer = await tx.exchangeOffer.findUnique({ where: { id } });
    if (!exchangeOffer) {
      throw new Error("교환제안을 찾을 수 없습니다.");
    }
    if (exchangeOffer.status !== "PENDING") {
      throw new Error("교환제안이 PENDING 상태가 아닙니다.");
    }

    // 2. 해당 saleCard 조회
    const saleCard = await tx.saleCard.findUnique({
      where: { id: exchangeOffer.saleCardId },
    });
    if (!saleCard) {
      throw new Error("판매 카드를 찾을 수 없습니다.");
    }
    if (saleCard.status !== "ON_SALE") {
      throw new Error("판매 카드가 ON_SALE 상태가 아닙니다.");
    }

    // 3. offerer가 제공하는 카드 인벤토리 확인
    const offererCard = await tx.userPhotoCard.findFirst({
      where: {
        ownerId: exchangeOffer.offererId,
        photoCardId: exchangeOffer.offeredCardId,
      },
    });
    if (!offererCard) {
      throw new Error("제공하는 카드가 없습니다.");
    }

    // 4. offerer 인벤토리 차감
    await tx.userPhotoCard.update({
      where: { id: offererCard.id },
      data: { quantity: offererCard.quantity - 1 },
    });

    // 5. seller의 인벤토리에 offerer가 제공한 카드 추가
    const sellerOfferedCard = await tx.userPhotoCard.findFirst({
      where: {
        ownerId: saleCard.sellerId,
        photoCardId: exchangeOffer.offeredCardId,
      },
    });
    // 이미 동일한 포토카드를 보유하고 있으면 수량 증가
    if (sellerOfferedCard) {
      await tx.userPhotoCard.update({
        where: { id: sellerOfferedCard.id },
        data: { quantity: sellerOfferedCard.quantity + 1 },
      });
    } else {
      // 카드가 없으면 생성
      await tx.userPhotoCard.create({
        data: {
          ownerId: saleCard.sellerId,
          photoCardId: exchangeOffer.offeredCardId,
          quantity: 1,
        },
      });
    }

    // 6. 판매 대상 카드를 seller의 인벤토리에서 차감
    const sellerSaleCard = await tx.userPhotoCard.findFirst({
      where: {
        ownerId: saleCard.sellerId,
        photoCardId: saleCard.photoCardId,
      },
    });
    if (!sellerSaleCard) {
      throw new Error("판매 카드가 없습니다.");
    }

    await tx.userPhotoCard.update({
      where: { id: sellerSaleCard.id },
      data: { quantity: sellerSaleCard.quantity - 1 },
    });

    // 7. 판매 대상 카드를 offerer 인벤토리에 추가
    const offererSaleCard = await tx.userPhotoCard.findFirst({
      where: {
        ownerId: exchangeOffer.offererId,
        photoCardId: saleCard.photoCardId,
      },
    });
    // 이미 동일한 포토카드를 보유하고 있으면 수량 증가
    if (offererSaleCard) {
      await tx.userPhotoCard.update({
        where: { id: offererSaleCard.id },
        data: { quantity: offererSaleCard.quantity + 1 },
      });
    } else {
      // 카드가 없으면 생성
      await tx.userPhotoCard.create({
        data: {
          ownerId: exchangeOffer.offererId,
          photoCardId: saleCard.photoCardId,
          quantity: 1,
        },
      });
    }

    // 8. saleCard 수량 차감, 수량이 0이면 SOLD_OUT 상태로 변경
    await tx.saleCard.update({
      where: { id: saleCard.id },
      data: {
        quantity: saleCard.quantity - 1,
        ...(saleCard.quantity - 1 === 0 ? { status: "SOLD_OUT" } : {}),
      },
    });

    // 9. 교환제안 상태 업데이트
    const acceptedOffer = await tx.exchangeOffer.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    // 10. 거래 내역 기록
    await tx.transactionLog.create({
      data: {
        transactionType: "exchange",
        transactionId: acceptedOffer.id,
        newOwnerId: exchangeOffer.offererId,
        oldOwnerId: saleCard.sellerId,
        quantity: 1,
        totalPrice: 0,
      },
    });

    return acceptedOffer as unknown as ExchangeOffer;
  });
};
