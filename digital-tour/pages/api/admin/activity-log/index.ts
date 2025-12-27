// pages/api/admin/activity-log/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sequelize } from "@/lib/db";
import { QueryTypes } from "sequelize";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

// ---------- Response Types ----------
interface Activity {
  id: number;
  admin: {
    name: string;
    email: string | null;
  };
  action: string;
  target: {
    type: string;
    id: number;
    display: string;
  };
  reason: string | null;
  states: {
    before: any | null;
    after: any | null;
  };
  createdAt: string;        // ISO string
  relativeTime: string;
}

interface ApiResponse {
  activities: Activity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ---------- Main Handler ----------
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { message: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // ---- Auth & Authorization ----
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ message: "Invalid token" });

    const [userRecord]: any = await sequelize.query(
      "SELECT role FROM users WHERE id = :id LIMIT 1",
      { replacements: { id: payload.id }, type: QueryTypes.SELECT }
    );

    if (!userRecord || userRecord.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // ---- Query Parameters ----
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const search = (req.query.search as string ?? "").trim();

    const replacements: any = { limit, offset, searchTerm: `%${search}%` };

    const searchFilter = search
      ? `WHERE (
          u.name LIKE :searchTerm OR
          u.email LIKE :searchTerm OR
          aa.action LIKE :searchTerm OR
          aa.reason LIKE :searchTerm
         )`
      : "";

    // ---- Parallel Queries: Total & Logs ----
    const [countResult, rawLogs] = await Promise.all([
      sequelize.query(
        `SELECT COUNT(*) AS total
         FROM admin_audits aa
         LEFT JOIN users u ON aa.admin_id = u.id
         ${searchFilter}`,
        { replacements, type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT
           aa.id,
           aa.action,
           aa.target_type,
           aa.target_id,
           aa.before_state,
           aa.after_state,
           aa.reason,
           aa.created_at,
           u.name AS admin_name,
           u.email AS admin_email,

           -- Target info
           tu.name AS target_user_name,
           tu.email AS target_user_email,
           tr.caption AS target_resource_caption,
           tl.name AS target_listing_name,
           tb.id AS target_booking_id,
           tlb.name AS booking_listing_name,
           tub.name AS booking_user_name

         FROM admin_audits aa
         LEFT JOIN users u ON aa.admin_id = u.id

         -- Targets
         LEFT JOIN users tu       ON aa.target_type = 'user'     AND aa.target_id = tu.id
         LEFT JOIN resources tr   ON aa.target_type = 'resource' AND aa.target_id = tr.id
         LEFT JOIN listings tl    ON aa.target_type = 'listing'  AND aa.target_id = tl.id
         LEFT JOIN bookings tb    ON aa.target_type = 'booking'  AND aa.target_id = tb.id
         LEFT JOIN listings tlb   ON tb.listing_id = tlb.id
         LEFT JOIN users tub      ON tb.user_id = tub.id

         ${searchFilter}
         ORDER BY aa.created_at DESC
         LIMIT :limit OFFSET :offset`,
        { replacements, type: QueryTypes.SELECT }
      ),
    ]);

    const total = Number((countResult[0] as any)?.total || 0);

    // ---- Transform to Clean Response ----
    const activities: Activity[] = (rawLogs as any[]).map((log) => {
      let display = `#${log.target_id}`;

      switch (log.target_type) {
        case "user":
          display = log.target_user_name || log.target_user_email || `User #${log.target_id}`;
          break;
        case "resource":
          display = log.target_resource_caption ? `"${log.target_resource_caption}"` : `Resource #${log.target_id}`;
          break;
        case "listing":
          display = log.target_listing_name || `Listing #${log.target_id}`;
          break;
        case "booking":
          if (log.booking_listing_name) {
            display = `${log.booking_listing_name} (#${log.target_id})`;
          } else if (log.booking_user_name) {
            display = `${log.booking_user_name} (#${log.target_id})`;
          } else {
            display = `Booking #${log.target_id}`;
          }
          break;
        default:
          display = `${log.target_type} #${log.target_id}`;
      }

      return {
        id: log.id,
        admin: {
          id: log.admin_id,
          name: log.admin_name || "System",
          email: log.admin_email,
          photoUrl: log.admin_photo_url,
        },
        action: log.action,
        target: {
          type: log.target_type,
          id: log.target_id,
          display,
          email: log.target_user_email,
        },
        reason: log.reason || null,
        states: {
          before: log.before_state,
          after: log.after_state,
        },
        createdAt: log.created_at,
        relativeTime: formatRelativeTime(new Date(log.created_at)),
      };
    });

    return res.status(200).json({
      activities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[ADMIN_ACTIVITY_LOG_ERROR]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ---------- Helper ----------
function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
