// pages/api/bookings/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Booking, User, Listing, Notification } from "@/models";
import { sequelize } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { QueryTypes } from "sequelize"; // ← Add this

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid booking id" });
  }

  try {
    /* ===================== GET ===================== */
    if (req.method === "GET") {
      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
          { model: Listing, as: "listing", attributes: ["id", "name", "location", "price"] },
        ],
      });
      if (!booking) return res.status(404).json({ message: "Booking not found" });
      return res.status(200).json(booking);
    }

    /* ===================== PUT (ADMIN ACTIONS) ===================== */
    if (req.method === "PUT") {
      const { action } = req.body;
      if (!action || !["confirm", "reject", "cancel"].includes(action)) {
        return res.status(400).json({ message: "Invalid or missing action" });
      }

      // ===== AUTH =====
      const token = getTokenFromRequest(req);
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      let admin: any;
      try {
        admin = verifyToken(token);
      } catch {
        return res.status(401).json({ message: "Invalid token" });
      }

      const result = await sequelize.transaction(async (t) => {
        const booking = await Booking.findByPk(id, { 
          transaction: t,
          lock: t.LOCK.UPDATE 
        });

        if (!booking) throw new Error("NOT_FOUND");

        const currentStatus = booking.get('status') as string;
        const targetUserId = booking.get('user_id') as number;

        if (!targetUserId) {
          throw new Error("DATA_ERROR: Booking is missing user_id");
        }

        // State Guards
        if ((action === "confirm" || action === "reject") && currentStatus !== "pending") {
          throw new Error(`GUARD: Booking is already ${currentStatus}`);
        }
        if (action === "cancel" && currentStatus !== "confirmed") {
          throw new Error("GUARD: Only confirmed bookings can be cancelled");
        }

        // Capture BEFORE state
        const beforeState = {
          status: currentStatus,
          payment_status: booking.get('payment_status'),
          decided_by: booking.get('decided_by'),
        };

        const updateData: any = {
          status: action === "confirm" ? "confirmed" : action === "reject" ? "rejected" : "cancelled",
        };

        if (action === "confirm") {
          updateData.payment_status = "paid";
          updateData.decided_by = admin.id;
          updateData.decided_at = new Date();
        } else if (action === "reject") {
          updateData.decided_by = admin.id;
          updateData.decided_at = new Date();
        } else if (action === "cancel") {
          updateData.payment_status = "refunded";
        }

        await booking.update(updateData, { transaction: t });

        // Capture AFTER state
        const afterState = {
          status: updateData.status,
          payment_status: updateData.payment_status || booking.get('payment_status'),
          decided_by: updateData.decided_by || booking.get('decided_by'),
        };

        // === AUDIT LOGGING ===
        const auditActionMap: Record<string, string> = {
          confirm: "confirm_booking",
          reject: "reject_booking",
          cancel: "cancel_booking",
        };

        try {
          await sequelize.query(
            `INSERT INTO admin_audits 
             (admin_id, action, target_type, target_id, before_state, after_state, reason, created_at)
             VALUES (?, ?, 'booking', ?, ?, ?, NULL, NOW())`,
            {
              replacements: [
                admin.id,
                auditActionMap[action],
                id,
                JSON.stringify(beforeState),
                JSON.stringify(afterState),
              ],
              type: QueryTypes.INSERT,
            }
          );
        } catch (auditErr) {
          console.error("Failed to log booking audit:", auditErr);
          // Don't break the main flow
        }

        // Notification
        await Notification.create({
          user_id: targetUserId,
          type: action === "confirm" ? "success" : action === "reject" ? "warning" : "info",
          title: `Booking ${action.charAt(0).toUpperCase() + action.slice(1)}`,
          message: `Your booking has been ${updateData.status}.`,
          is_read: false,
        }, { transaction: t });

        return booking.reload(); // Return fresh data
      });

      return res.status(200).json(result);
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (error: any) {
    console.error("Server Error:", error);
    
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (error.message.startsWith("GUARD")) {
      return res.status(409).json({ message: error.message.split(": ")[1] });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: "Validation error", details: error.errors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}