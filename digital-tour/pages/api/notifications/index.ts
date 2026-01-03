// pages/api/notifications/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Notification, User } from "@/models";
import { sequelize } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    await sequelize.authenticate();

    // --- GET: Fetch Notifications ---
    if (method === "GET") {
      const { userId, isAdmin } = req.query;
      const where: any = {};

      // Filter by User ID if provided
      if (userId) {
        where.user_id = Number(userId);
      }

      // PRODUCTION FILTER: Separate User vs Admin notifications
      // If isAdmin is missing from query, it fetches all (mixed)
      if (isAdmin === "true") {
        where.is_admin = true;
      } else if (isAdmin === "false") {
        where.is_admin = false;
      }

      const notifications = await Notification.findAll({
        where,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: User,
            as: "notificationUser", // Matches alias in models/Association.ts
            attributes: ["id", "name", "photo_url"],
          },
        ],
      });

      return res.status(200).json(notifications);
    }

    // --- POST: Create Notification ---
    if (method === "POST") {
      const { user_id, type, title, message, is_admin } = req.body;

      // Creates a new notification with type safety for Sequelize BOOLEAN
      const newNotification = await Notification.create({
        user_id,
        type: type || "info",
        title,
        message,
        is_admin: !!is_admin, // Forces boolean type
        is_read: false, // Default to unread
      });

      return res.status(201).json(newNotification);
    }

    // Fallback for unsupported methods
    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    // Log exact error for debugging in development
    console.error("Notification API Error:", err.message);

    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}
