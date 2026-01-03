// digital-tour/hooks/useNotifications.ts
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
import type { Notification } from "@/store/slices/notificationSlice";

// Match exactly what the service and components use
type ViewMode = "all" | "user" | "admin";

export function useNotifications(userId?: number, viewMode: ViewMode = "user") {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const allNotifications = useSelector(
    (state: RootState) => state.notifications.items
  );

  /**
   * FILTER LOGIC:
   * This is why your screen is empty. If viewMode is 'admin',
   * we only show items where is_admin is TRUE.
   */
  const notifications = allNotifications.filter((n) => {
    if (viewMode === "admin") return n.is_admin === true;
    if (viewMode === "user") return n.is_admin === false;
    return true; // "all"
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // We pass the viewMode here to filter at the Database level
      const data = await notificationService.getByUser(userId, viewMode);

      const mapped: Notification[] = data.map((n: any) => ({
        id: n.id,
        user_id: n.user_id,
        type: n.type,
        is_admin: Boolean(n.is_admin),
        title: n.title,
        message: n.message,
        is_read: Boolean(n.is_read),
        created_at: n.created_at,
        updated_at: n.updated_at,
      }));

      dispatch(setNotifications(mapped));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, viewMode, dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const readOne = async (id: number) => {
    dispatch(markAsRead(id));
    try {
      await notificationService.markRead(id);
    } catch (err) {
      console.error("Failed to mark as read on server:", err);
      fetchNotifications();
    }
  };

  const readAll = async () => {
    dispatch(markAllAsRead());
    try {
      await notificationService.markAllRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchNotifications();
    }
  };

  const push = (notification: Notification) => {
    dispatch(addNotification(notification));
  };

  return {
    notifications,
    unreadCount,
    loading,
    readOne,
    readAll,
    push,
    refresh: fetchNotifications,
  };
}

// // digital-tour/hooks/useNotifications.ts
// import { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store";
// import {
//   setNotifications,
//   addNotification,
//   markAsRead,
//   markAllAsRead,
// } from "@/store/slices/notificationSlice";
// import notificationService from "@/services/notificationservice";
// import type { Notification } from "@/store/slices/notificationSlice";

// type ViewMode = "all" | "user" | "admin";

// export function useNotifications(userId?: number, viewMode: ViewMode = "user") {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);

//   const allNotifications = useSelector(
//     (state: RootState) => state.notifications.items
//   );

//   // Filter based on the 'is_admin' flag
//   const notifications = allNotifications.filter((n) => {
//     if (viewMode === "admin") return n.is_admin === true;
//     if (viewMode === "user") return n.is_admin === false;
//     return true;
//   });

//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   const fetchNotifications = useCallback(async () => {
//     if (!userId) return;
//     setLoading(true);
//     try {
//       // PRODUCTION FIX: Pass viewMode to service so the API filters correctly
//       const data = await notificationService.getByUser(userId, viewMode);

//       const mapped: Notification[] = data.map((n: any) => ({
//         id: n.id,
//         user_id: n.user_id,
//         type: n.type,
//         is_admin: Boolean(n.is_admin),
//         title: n.title,
//         message: n.message,
//         is_read: Boolean(n.is_read),
//         created_at: n.created_at,
//         updated_at: n.updated_at,
//       }));

//       dispatch(setNotifications(mapped));
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, viewMode, dispatch]); // Added viewMode as dependency

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   const readOne = async (id: number) => {
//     dispatch(markAsRead(id));
//     try {
//       await notificationService.markRead(id);
//     } catch (err) {
//       console.error("Failed to mark as read on server:", err);
//       fetchNotifications();
//     }
//   };

//   const readAll = async () => {
//     dispatch(markAllAsRead());
//     try {
//       await notificationService.markAllRead();
//     } catch (err) {
//       console.error("Failed to mark all as read:", err);
//       fetchNotifications();
//     }
//   };

//   const push = (notification: Notification) => {
//     dispatch(addNotification(notification));
//   };

//   return {
//     notifications,
//     unreadCount,
//     loading,
//     readOne,
//     readAll,
//     push,
//     refresh: fetchNotifications,
//   };
// }
