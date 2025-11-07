"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import { Notification } from "@/types/notification.types";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch toàn bộ noti theo user
  const fetchNotifications = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get<Notification[]>(
        `${process.env.NEXT_PUBLIC_API_BASE}/notifications?userId=${userId}&_sort=-createdAt`
      );
      const notis = res.data;
      setNotifications(notis);
      setUnreadCount(notis.filter((n) => !n.isSeen).length);
    } catch {
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // thêm noti mới vào local state (VD: push realtime)
  const addNotification = useCallback((n: Notification) => {
    setNotifications((prev) => [n, ...prev]);
    if (!n.isSeen) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  // đánh dấu 1 noti đã đọc
  const markAsSeen = useCallback(async (id: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE}/notifications/${id}`,
        { isSeen: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isSeen: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark as seen", err);
    }
  }, []);

  // đánh dấu tất cả đã đọc
  const markAllAsSeen = useCallback(async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.isSeen)
          .map((n) =>
            axios.patch(
              `${process.env.NEXT_PUBLIC_API_BASE}/notifications/${n.id}`,
              { isSeen: true }
            )
          )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as seen", err);
    }
  }, [notifications]);

  // xóa local state
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    addNotification,
    markAsSeen,
    markAllAsSeen,
    clearNotifications,
  };
};
