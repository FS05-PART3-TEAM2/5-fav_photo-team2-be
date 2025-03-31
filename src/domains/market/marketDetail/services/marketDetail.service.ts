import { PrismaClient } from "@prisma/client";
import {
  MarketDetailResponse,
  MarketItemOffer,
} from "../interfaces/marketDetail.interfaces";

export class MarketDetailService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 마켓 아이템 상세 정보 조회
   *
   * @param id 마켓 아이템 ID
   * @param userId 현재 로그인한 사용자 ID
   * @returns 마켓 아이템 상세 정보 및 소유 정보
   */
  async getMarketItemDetail(
    id: string,
    userId: string
  ): Promise<MarketDetailResponse> {
    // 마켓 아이템 기본 정보 조회
    const photoCard = await this.prisma.photoCard.findUnique({
      where: { id },
    });

    if (!photoCard) {
      throw new Error(`ID가 ${id}인 마켓 아이템을 찾을 수 없습니다.`);
    }

    // 마켓 아이템 등록자 정보 조회
    const creator = await this.prisma.user.findUnique({
      where: { id: photoCard.creatorId },
    });

    if (!creator) {
      throw new Error("마켓 아이템 등록자 정보를 찾을 수 없습니다.");
    }

    // 사용자 소유 여부 확인
    const userPhotoCard = await this.prisma.userPhotoCard.findFirst({
      where: {
        photoCardId: id,
        ownerId: userId,
      },
    });

    const isMine = !!userPhotoCard;

    // 기본 응답 구성
    const response: MarketDetailResponse = {
      id: photoCard.id,
      userNickname: creator.nickname,
      imageUrl: photoCard.imageUrl,
      name: photoCard.name,
      grade: photoCard.grade,
      genre: photoCard.genre,
      description: photoCard.description,
      price: photoCard.price,
      availableAmount: userPhotoCard?.quantity || 0,
      totalAmount: userPhotoCard?.quantity || 0,
      createdAt: photoCard.createdAt.toISOString(),
      exchangeDetail: {
        grade: "RARE",
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
      const exchangeOffers = await this.prisma.exchangeOffer.findMany({
        where: {
          saleCardId: id,
          status: "PENDING",
        },
      });

      // 교환 제안 상세 정보 조회
      if (exchangeOffers.length > 0) {
        const offersWithDetails: MarketItemOffer[] = await Promise.all(
          exchangeOffers.map(async (offer: any) => {
            const offeredCard = await this.prisma.photoCard.findUnique({
              where: { id: offer.offeredCardId },
            });

            const offerer = await this.prisma.user.findUnique({
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
      const myOffers = await this.prisma.exchangeOffer.findMany({
        where: {
          saleCardId: id,
          offererId: userId,
          status: "PENDING",
        },
      });

      if (myOffers.length > 0) {
        const myOffersWithDetails: MarketItemOffer[] = await Promise.all(
          myOffers.map(async (offer: any) => {
            const offeredCard = await this.prisma.photoCard.findUnique({
              where: { id: offer.offeredCardId },
            });

            // 자신의 닉네임 조회
            const offerer = await this.prisma.user.findUnique({
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

    return response;
  }
}
