// pages/api/admin/dashboard/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sequelize } from "@/lib/db";
import { QueryTypes } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

type DashboardResponse = {
  stats: {
    totalUsers: number;
    activeBookings: number;
    pendingNotifications: number;
    pendingResources: number;
    liveListings: number;
    totalResources: number;
    systemUptime: string;
  };
  recentActivity: {
    id: number;
    userName: string;
    userInitial: string;
    action: string;
    target: string;
    timestamp: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse | { message: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  let payload;
  try {
    payload = verifyToken(token) as { id: number };
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Verify admin access
  const [currentUser] = await sequelize.query(
    `SELECT role FROM users WHERE id = ? LIMIT 1`,
    { replacements: [payload.id], type: QueryTypes.SELECT }
  );

  if (!currentUser || (currentUser as any).role !== "admin") {
    return res.status(403).json({ message: "Administrators only" });
  }

  try {
    // === All Stats in Parallel ===
    const [
      usersResult,
      activeBookingsResult,
      unreadNotificationsResult,
      pendingResourcesResult,
      liveListingsResult,
      totalResourcesResult,
      auditsResult,
    ] = await Promise.all([
      sequelize.query(`SELECT COUNT(*) AS count FROM users`, {
        type: QueryTypes.SELECT,
      }),
      sequelize.query(
        `SELECT COUNT(*) AS count FROM bookings WHERE status IN ('pending', 'confirmed')`,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT COUNT(*) AS count FROM notifications WHERE is_read = false`,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT COUNT(*) AS count FROM resources WHERE status = 'pending'`,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT COUNT(*) AS count FROM listings WHERE status = 'active'`,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query(`SELECT COUNT(*) AS count FROM resources`, {
        type: QueryTypes.SELECT,
      }),
      sequelize.query(
        `
        SELECT 
          aa.id,
          aa.action,
          aa.target_type,
          aa.target_id,
          aa.created_at,
          u.name AS admin_name
        FROM admin_audits aa
        LEFT JOIN users u ON aa.admin_id = u.id
        ORDER BY aa.created_at DESC
        LIMIT 10
        `,
        { type: QueryTypes.SELECT }
      ),
    ]);

    const stats = {
      totalUsers: Number((usersResult[0] as any).count),
      activeBookings: Number((activeBookingsResult[0] as any).count),
      pendingNotifications: Number((unreadNotificationsResult[0] as any).count),
      pendingResources: Number((pendingResourcesResult[0] as any).count),
      liveListings: Number((liveListingsResult[0] as any).count),
      totalResources: Number((totalResourcesResult[0] as any).count),
      systemUptime: "99.9%",
    };

    // === Recent Activity Formatting ===
    const recentActivity = (auditsResult as any[]).map((log) => {
      const userName = log.admin_name || "System";
      let actionText = "";
      let targetText = `#${log.target_id}`;

      switch (log.action) {
        case "grant_admin":
          actionText = "granted admin access to";
          targetText = `user ${targetText}`;
          break;
        case "revoke_admin":
          actionText = "revoked admin access from";
          targetText = `user ${targetText}`;
          break;
        case "approve_resource":
          actionText = "approved tour upload";
          break;
        case "reject_resource":
          actionText = "rejected tour upload";
          break;
        case "confirm_booking":
          actionText = "confirmed booking";
          break;
        case "reject_booking":
          actionText = "rejected booking";
          break;
        case "cancel_booking":
          actionText = "cancelled booking";
          break;
        default:
          actionText = log.action.replace(/_/g, " ");
      }

      const nameParts = userName.trim().split(/\s+/);

      const userInitial =
        nameParts.length > 1
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : nameParts[0][0].toUpperCase();

      return {
        id: log.id,
        userName,
        userInitial,
        action: actionText,
        target: targetText,
        timestamp: formatRelativeTime(new Date(log.created_at)),
      };
    });

    return res.status(200).json({ stats, recentActivity });
  } catch (error) {
    console.error("Admin Dashboard API error:", error);
    return res.status(500).json({ message: "Failed to load dashboard data" });
  }
}

// Helper: Human-readable time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffMins < 1) return `just now`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
