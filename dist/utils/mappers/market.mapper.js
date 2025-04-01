"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMarketResponse = void 0;
const toMarketResponse = (card, count) => {
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
exports.toMarketResponse = toMarketResponse;
