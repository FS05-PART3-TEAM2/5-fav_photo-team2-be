/**
 * 포토카드 관련 라우트 정의
 *
 * Express 라우터를 사용하여 API 경로 설정
 */

import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /api/photocards/:id - 포토카드 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // 실제 구현 시 토큰에서 사용자 ID 추출 필요 (인증 미들웨어 제거로 인해 임시 ID 사용)
    const userId = "임시 사용자 ID";

    // 포토카드 기본 정보 조회
    const photoCard = await prisma.photoCard.findUnique({
      where: { id },
    });

    if (!photoCard) {
      return res.status(404).json({
        message: `ID가 ${id}인 포토카드를 찾을 수 없습니다.`,
      });
    }

    // 포토카드 생성자 정보 조회
    const creator = await prisma.user.findUnique({
      where: { id: photoCard.creatorId },
    });

    if (!creator) {
      return res.status(404).json({
        message: "포토카드 생성자 정보를 찾을 수 없습니다.",
      });
    }

    // 사용자 소유 여부 확인
    const userPhotoCard = await prisma.userPhotoCard.findFirst({
      where: {
        photoCardId: id,
        ownerId: userId,
      },
    });

    const isMine = !!userPhotoCard;

    // 기본 응답 구성
    const response = {
      id: photoCard.id,
      userNickname: creator.nickname,
      imageUrl: photoCard.imageUrl,
      name: photoCard.name,
      grade: photoCard.grade,
      genre: photoCard.genre,
      description: photoCard.description,
      price: photoCard.price,
      availableAmount: userPhotoCard?.quantity || 0,
      totalAmount: userPhotoCard?.quantity || 0, // 실제로는 총량 계산 필요
      createdAt: photoCard.createdAt.toISOString(),
      exchangeDetail: {
        grade: "RARE", // 교환 희망 정보는 별도 저장 필요
        genre: "인물",
        description:
          "푸릇푸릇한 여름 풍경, 눈 많이 내린 겨울 풍경 사진에 관심이 많습니다.",
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
        const offersWithDetails = await Promise.all(
          exchangeOffers.map(async (offer) => {
            const offeredCard = await prisma.photoCard.findUnique({
              where: { id: offer.offeredCardId },
            });

            const offerer = await prisma.user.findUnique({
              where: { id: offer.offererId },
            });

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
        const myOffersWithDetails = await Promise.all(
          myOffers.map(async (offer) => {
            const offeredCard = await prisma.photoCard.findUnique({
              where: { id: offer.offeredCardId },
            });

            // 자신의 닉네임 조회
            const offerer = await prisma.user.findUnique({
              where: { id: userId },
            });

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
      }
    }

    return res.json(response);
  } catch (error) {
    console.error("포토카드 조회 실패:", error);
    return res.status(500).json({
      message: "포토카드 조회 중 오류가 발생했습니다.",
    });
  }
});

export default router;
