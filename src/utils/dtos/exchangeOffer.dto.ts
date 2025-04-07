import { saleCardDto } from "./saleCard.dto";

export interface ExchangeOfferDto {
  id: string;
  offererId: string;
  userPhotoCardId: string;
  status: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  saleCard: saleCardDto;
}
