// 교환 제안 정보 인터페이스
export interface Offer {
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

// 기본 상세 정보 인터페이스
export interface BasicDetail {
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

// 교환 제안 정보 인터페이스
export interface ExchangeInfo {
  id: string;
  isMine: boolean;
  receivedOffers: Offer[] | null;
  myOffers: Offer[] | null;
}

// 마켓 전체 상세 응답 인터페이스 (기본 정보 + 교환 제안 정보)
export interface DetailResponse extends BasicDetail {
  receivedOffers: Offer[] | null;
  myOffers: Offer[] | null;
}

// 이전 인터페이스 이름 호환성 유지를 위한 타입 별칭
export type MarketItemOffer = Offer;
export type MarketBasicDetailResponse = BasicDetail;
export type MarketExchangeDetailResponse = ExchangeInfo;
export type MarketDetailResponse = DetailResponse;
