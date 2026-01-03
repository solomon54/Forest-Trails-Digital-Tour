// services/notificationservice.ts
import apiClient from "./apiClient";
import type { Notification } from "@/store/slices/notificationSlice";

const notificationService = {
  // Pass viewMode to filter logic on the server
  async getByUser(
    userId: number,
    viewMode: "user" | "admin" = "user"
  ): Promise<Notification[]> {
    const res = await apiClient.get("/notifications", {
      params: {
        userId,
        isAdmin: viewMode === "admin" ? "true" : "false", //
      },
    });
    return res.data;
  },

  async markRead(id: number): Promise<void> {
    await apiClient.put(`/notifications/${id}`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.put("/notifications");
  },
};

export default notificationService;
