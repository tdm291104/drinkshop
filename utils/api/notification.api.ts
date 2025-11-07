import axios from "axios";
import { NotificationCreate } from "@/types/notification.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export const addNotification = async (
  userId: string,
  title: string,
  message: string,
  link?: string
) => {
  const notification: NotificationCreate = {
    userId: userId,
    title: title,
    message: message,
    isSeen: false,
    createdAt: new Date().toISOString(),
    ...(link ? { link } : {}),
  };
  try {
    await axios.post(`${BASE_URL}/notifications`, notification);
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};
