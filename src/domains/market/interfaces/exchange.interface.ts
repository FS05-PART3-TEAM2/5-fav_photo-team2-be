export interface ExchangeOffer {
  id: string;
  saleCardId: string;
  offererId: string;
  offeredCardId: string;
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
