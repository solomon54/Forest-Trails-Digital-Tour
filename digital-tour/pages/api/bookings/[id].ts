// pages/api/bookings/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Booking, User, Listing, BookingContact, Notification } from "@/models";
import { sequelize } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

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
          { model: BookingContact, as: "contact" }
        ]
      });

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json(booking);
    }

    /* ===================== PUT ===================== */
    if (req.method === "PUT") {
      const { action } = req.body;
      if (!action) {
        return res.status(400).json({ message: "Missing action" });
      }

      /* ===== AUTH ===== */
      const token = getTokenFromRequest(req);
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      let admin: any;
      try {
        admin = verifyToken(token);
      } catch {
        return res.status(401).json({ message: "Invalid token" });
      }

      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      /* ===== STATE GUARDS (NO TRANSACTION YET) ===== */
      if (action === "confirm" && booking.status !== "pending") {
        return res.status(409).json({ message: `Booking already ${booking.status}` });
      }

      if (action === "reject" && booking.status !== "pending") {
        return res.status(409).json({ message: `Booking already ${booking.status}` });
      }

      if (action === "cancel" && booking.status !== "confirmed") {
        return res.status(409).json({ message: `Only confirmed bookings can be cancelled` });
      }

      /* ===== TRANSACTION ===== */
      const updatedBooking = await sequelize.transaction(async (t) => {
        if (action === "confirm") {
          await booking.update(
            {
              status: "confirmed",
              payment_status: "paid",
              decided_by: admin.id,
              decided_at: new Date()
            },
            { transaction: t }
          );
        }

        if (action === "reject") {
          await booking.update(
            {
              status: "rejected",
              decided_by: admin.id,
              decided_at: new Date()
            },
            { transaction: t }
          );
        }

        if (action === "cancel") {
          await booking.update(
            {
              status: "cancelled",
              payment_status: "refunded"
            },
            { transaction: t }
          );
        }

        await Notification.create(
          {
            user_id: booking.user_id,
            type: action === "confirm" ? "success" : action === "reject" ? "warning" : "info",
            title: `Booking ${booking.status}`,
            message: `Your booking has been ${booking.status}.`,
            is_read: false
          },
          { transaction: t }
        );

        return booking;
      });

      return res.status(200).json(updatedBooking);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
