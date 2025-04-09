import {
  MarketCardDto,
  MarketMeResponse,
  MarketResponse,
} from "../../domains/market/types/market.type";
import { MarketOfferDto } from "../dtos/marketOffer.dto";

export const toMarketResponse = (
  card: MarketCardDto,
  count: number
): MarketResponse => {
  return {
    saleCardId: card.id,
    userPhotoCardId: card.photoCardId,
    status: card.status,
    name: card.photoCard.name,
    genre: card.photoCard.genre,
    grade: card.photoCard.grade,
    price: card.price,
    image: card.photoCard.imageUrl,
    total: card.quantity,
    remaining: card.quantity - count,
    exchangeDescription: card.exchangeDescription,
    exchangeGrade: card.exchangeGrade,
    exchangeGenre: card.exchangeGenre,
    creator: {
      id: card.photoCard.creator.id,
      nickname: card.photoCard.creator.nickname,
    },
    seller: {
      id: card.seller.id,
      nickname: card.seller.nickname,
    },
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
};

export const toMarketMeResponse = (card: MarketOfferDto): MarketMeResponse => {
  const offer = card.saleCard
    ? {
        status: card.saleCard.status,
        saleCard: card.saleCard,
        total: card.saleCard.quantity,
        remaining:
          card.saleCard.quantity - (card.saleCard.totalTradedQuantity || 0),
      }
    : card.exchangeOffer
    ? {
        status: card.exchangeOffer.status,
        saleCard: card.exchangeOffer.saleCard,
        total: 1,
        remaining: 1,
      }
    : null;

  if (!offer)
    throw new Error(
      "Invalid MarketOfferDto: Missing saleCard or exchangeOffer"
    );

  return {
    saleCardId: card.id,
    status: offer.status,
    name: offer.saleCard.photoCard.name,
    genre: offer.saleCard.photoCard.genre,
    grade: offer.saleCard.photoCard.grade,
    price: offer.saleCard.price,
    image: offer.saleCard.photoCard.imageUrl,
    total: offer.total,
    remaining: offer.remaining,
    creator: {
      id: offer.saleCard.photoCard.creator.id,
      nickname: offer.saleCard.photoCard.creator.nickname,
    },
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
};
