export interface NotificationResponseDto {
  id: string;
  type: string;
  message: string;
  createdAt: Date;
  readAt: Date | null;
}
