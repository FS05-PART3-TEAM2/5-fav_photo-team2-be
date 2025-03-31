// 교환 제안 정보 인터페이스
export interface MarketItemOffer {
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

// 마켓 상세 응답 인터페이스
export interface MarketDetailResponse {
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
  isMine: boolean;
  exchangeDetail: {
    grade: string;
    genre: string;
    description: string;
  };
  receivedOffers: MarketItemOffer[] | null;
  myOffers: MarketItemOffer[] | null;
}
