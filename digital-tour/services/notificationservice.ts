// services/notificationservice.ts
import apiClient from "./apiClient";
import type { Notification } from "@/types/notification";

const notificationService = {
  // Get notifications by user
  async getByUser(userId: number): Promise<Notification[]> {
    const res = await apiClient.get("/notifications", {
      params: { userId },
    });
    return res.data;
  },

  // Mark one notification as read
  async markRead(id: number): Promise<void> {
    await apiClient.put(`/notifications/${id}`);
  },

  // Mark all notifications as read (optional endpoint)
  async markAllRead(): Promise<void> {
    await apiClient.put("/notifications");
  },
};

export default notificationService;
