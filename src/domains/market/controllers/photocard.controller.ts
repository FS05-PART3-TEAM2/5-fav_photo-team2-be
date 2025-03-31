import { PhotoCardService } from "../services/photocard.service";
import { PhotoCardDetailResponse } from "../interfaces/photocard.interfaces";

export class PhotoCardController {
  constructor(private readonly photocardService: PhotoCardService) {}

  async getPhotoCardDetail(
    id: string,
    userId: string
  ): Promise<PhotoCardDetailResponse> {
    return this.photocardService.getPhotoCardDetail(id, userId);
  }
}
