// digital-tour/store/slices/notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** * Matches the MySQL Schema exactly:
 * is_admin (tinyint) -> boolean
 * is_read  (tinyint) -> boolean
 * created_at (timestamp) -> string
 */
export interface Notification {
  id: number;
  user_id: number;
  type: "success" | "info" | "warning" | "error";
  is_admin: boolean;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationState {
  items: Notification[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Completely replace notifications (on fetch)
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
    },

    // Add a single notification (for real-time Pusher/Socket events)
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload); // Add to the top of the list
    },

    // Update is_read for a specific notification
    markAsRead(state, action: PayloadAction<number>) {
      const index = state.items.findIndex((n) => n.id === action.payload);
      if (index !== -1) {
        state.items[index].is_read = true;
      }
    },

    // Global update for the current view
    markAllAsRead(state) {
      state.items.forEach((n) => {
        n.is_read = true;
      });
    },
  },
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
