export interface PhotoCard {
  id: string;
  creatorId: string;
  name: string;
  genre: string;
  grade: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeOffer {
  id: string;
  offererNickname: string;
  name: string;
  description: string;
  imageUrl: string;
  grade: string;
  genre: string;
  price: number;
  createdAt: string;
}

export interface ExchangeDetail {
  grade: string;
  genre: string;
  description: string;
}

export interface PhotoCardDetailResponse {
  id: string;
  userNickname: string;
  imageUrl: string;
  name: string;
  grade: string;
  genre: string;
  description: string;
  price: number;
  availableAmount: number;
  totalAmount: number;
  createdAt: string;
  exchangeDetail: ExchangeDetail;
  isMine: boolean;
  receivedOffers: ExchangeOffer[] | null;
  myOffers: ExchangeOffer[] | null;
}

