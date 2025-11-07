export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  userId: string;
  isSeen: boolean;
  link?: string;
}

export interface NotificationCreate extends Omit<Notification, "id"> {}
