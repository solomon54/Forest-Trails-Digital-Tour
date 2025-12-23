import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
} from "@/store/slices/notificationSlice";
import notificationService from "@/services/notificationservice";
import type { Notification } from "@/types/notification";

export function useNotifications(userId?: number) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // 1. Select data from Redux Store
  const notifications = useSelector(
    (state: RootState) => state.notifications.items
  );
  
  // Calculate unread count from the store items
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // 2. Fetch Notifications from API on mount/user change
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationService.getByUser(userId);
        dispatch(setNotifications(data));
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, dispatch]);

  // 3. Action: Push new (for real-time/Pusher updates)
  const push = useCallback((notification: Notification) => {
    dispatch(addNotification(notification));
  }, [dispatch]);

  // 4. Action: Mark single as read (Update State + API)
  const readOne = async (id: number) => {
    // Optimistic Update: Update Redux immediately
    dispatch(markAsRead(id)); 
    try {
      await notificationService.markRead(id);
    } catch (err) {
      // Optional: rollback logic if API fails
      console.error("Failed to sync read status with server", err);
    }
  };

  // 5. Action: Mark all as read (Update State + API)
  const readAll = async () => {
    dispatch(markAllAsRead());
    try {
      await notificationService.markAllRead();
    } catch (err) {
      console.error("Failed to sync mark-all-read with server", err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    push,
    readOne,
    readAll,
  };
}