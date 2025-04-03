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

// 교환 상세 정보 인터페이스
export interface ExchangeDetail {
  grade: string;
  genre: string;
  description: string;
}

// SSR용 기본 상세 정보 인터페이스
export interface MarketBasicDetailResponse {
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
  totalOwnAmount: number;
  createdAt: string;
  isMine: boolean;
  exchangeDetail: ExchangeDetail;
}

// CSR용 교환 제안 정보 인터페이스
export interface MarketExchangeDetailResponse {
  id: string;
  isMine: boolean;
  receivedOffers: MarketItemOffer[] | null;
  myOffers: MarketItemOffer[] | null;
}

// 마켓 전체 상세 응답 인터페이스 (기본 정보 + 교환 제안 정보)
export interface MarketDetailResponse extends MarketBasicDetailResponse {
  receivedOffers: MarketItemOffer[] | null;
  myOffers: MarketItemOffer[] | null;
}
