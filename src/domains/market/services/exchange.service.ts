import { PrismaClient, Prisma } from "@prisma/client";
import { ExchangeOffer } from "../interfaces/exchange.interface";
import { CustomError } from "../../../utils/errors";
import { createNotification } from "../../notification/services/notificationService";

const prisma = new PrismaClient();

/**
 * 교환제안 취소/거절
 * @param id 교환제안 ID
 */
export const declineOffer = async (id: string): Promise<ExchangeOffer> => {
  return prisma.exchangeOffer.update({
    where: { id },
    data: { status: "FAILED" },
  });
};

/**
 * 교환제안 승인
 *
 * @param id 교환제안 ID
 *
 * seller : 판매 카드 소유자
 * offerer : 교환 제안자 (카드 미소유)
 * seller -> offerer : 판매 카드 제공
 */
export const acceptOffer = async (id: string): Promise<ExchangeOffer> => {
  return prisma.$transaction(async (tx) => {
    // 1. 교환제안 조회
    const exchangeOffer = await tx.exchangeOffer.findUnique({ where: { id } });
    if (!exchangeOffer) {
      throw new CustomError("교환제안을 찾을 수 없습니다.", 404);
    }
    if (exchangeOffer.status !== "PENDING") {
      throw new CustomError("교환제안이 PENDING 상태가 아닙니다.", 400);
    }

    // 2. 해당 saleCard 조회
    const saleCard = await tx.saleCard.findUnique({
      where: { id: exchangeOffer.saleCardId },
    });
    if (!saleCard) {
      throw new CustomError("판매 카드를 찾을 수 없습니다.", 404);
    }
    if (saleCard.status !== "ON_SALE") {
      throw new CustomError("판매 카드가 ON_SALE 상태가 아닙니다.", 400);
    }

    // 4. 판매 대상 카드를 seller의 인벤토리에서 차감
    // seller의 판매 카드에 락 설정
    const sellerSaleCardSQL = `
      SELECT * FROM "UserPhotoCard" 
      WHERE "ownerId" = '${saleCard.sellerId}' 
      AND "photoCardId" = '${saleCard.photoCardId}'
      FOR UPDATE
    `;
    await tx.$executeRaw(Prisma.raw(sellerSaleCardSQL));

    const sellerSaleCard = await tx.userPhotoCard.findFirst({
      where: {
        ownerId: saleCard.sellerId,
        photoCardId: saleCard.photoCardId,
      },
    });
    if (!sellerSaleCard) {
      throw new CustomError("판매 카드가 없습니다.", 404);
    }

    await tx.userPhotoCard.update({
      where: { id: sellerSaleCard.id },
      data: { quantity: sellerSaleCard.quantity - 1 },
    });

    // 5. 판매 대상 카드를 offerer 인벤토리에 추가
    // offerer의 판매 카드 락 설정
    const offererSaleCardSQL = `
      SELECT * FROM "UserPhotoCard" 
      WHERE "ownerId" = '${exchangeOffer.offererId}' 
      AND "photoCardId" = '${saleCard.photoCardId}'
      FOR UPDATE
    `;
    await tx.$executeRaw(Prisma.raw(offererSaleCardSQL));

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

    // 6. saleCard 수량 차감, 수량이 0이면 SOLD_OUT 상태로 변경
    // saleCard에 락 설정
    await tx.$executeRaw`SELECT * FROM "SaleCard" WHERE id = ${saleCard.id} FOR UPDATE`;

    await tx.saleCard.update({
      where: { id: saleCard.id },
      data: {
        quantity: saleCard.quantity - 1,
        ...(saleCard.quantity - 1 === 0 ? { status: "SOLD_OUT" } : {}),
      },
    });

    // 7. 교환제안 상태 업데이트
    // 교환제안에도 락 설정
    await tx.$executeRaw`SELECT * FROM "ExchangeOffer" WHERE id = ${id} FOR UPDATE`;

    const acceptedOffer = await tx.exchangeOffer.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });

    // 8. 거래 내역 기록
    await tx.transactionLog.create({
      data: {
        transactionType: "EXCHANGE",
        saleCardId: saleCard.id,
        newOwnerId: exchangeOffer.offererId,
        oldOwnerId: saleCard.sellerId,
        quantity: 1,
        totalPrice: 0,
      },
    });

    // 9. 알림 생성
    await createNotification({
      userId: saleCard.sellerId,
      message: "교환 제안이 승인되었습니다.",
    });

    await createNotification({
      userId: exchangeOffer.offererId,
      message: "교환이 성사되었습니다.",
    });

    return acceptedOffer as unknown as ExchangeOffer;
  });
};
