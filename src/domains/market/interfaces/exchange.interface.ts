export type ExchangeStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "FAILED";

export interface ExchangeOffer {
  id: string;
  saleCardId: string;
  offererId: string;
  offeredCardId: string;
  status: ExchangeStatus;
  createdAt: Date;
  updatedAt: Date;
}
