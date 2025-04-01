export interface NotificationResponseDto {
  id: string;
  message: string;
  createdAt: Date;
  readAt: Date | null;
}
