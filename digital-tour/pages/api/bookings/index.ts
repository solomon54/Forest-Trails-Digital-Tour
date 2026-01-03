// pages/api/bookings/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Booking, Listing, BookingContact, User, Notification } from "@/models";
import { sequelize } from "@/lib/db";
import { Op } from "sequelize"; // ← THIS WAS MISSING!

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { tab = "pending", page = "1", limit = "10" } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      const whereClause: any = {};
      if (tab === "pending") whereClause.status = "pending";
      if (tab === "approved") whereClause.status = "confirmed";
      if (tab === "rejected") whereClause.status = "rejected";

      const { rows, count } = await Booking.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Listing,
            as: "listing",
            attributes: ["id", "name", "location"],
          },
          { model: BookingContact, as: "contact" },
        ],
        order: [["created_at", "DESC"]],
        limit: limitNum,
        offset,
      });

      return res.status(200).json({
        bookings: rows,
        total: count,
        page: pageNum,
        limit: limitNum,
      });
    }

    // POST (create new booking)
    if (req.method === "POST") {
      const {
        user_id,
        listing_id,
        start_date,
        end_date,
        payment_method,
        contact,
      } = req.body;
      if (
        !user_id ||
        !listing_id ||
        !start_date ||
        !end_date ||
        !payment_method ||
        !contact
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await sequelize.transaction(async (t) => {
        // Create booking
        const createdBooking = await Booking.create(
          {
            user_id,
            listing_id,
            start_date,
            end_date,
            payment_method,
            status: "pending",
            payment_status: "pending",
          },
          { transaction: t }
        );

        // Create contact info
        await BookingContact.create(
          {
            booking_id: createdBooking.id,
            ...contact,
          },
          { transaction: t }
        );

        // === 1. Notify the USER that booking was submitted ===
        const user = await User.findByPk(user_id, { attributes: ["name"] });
        const listing = await Listing.findByPk(listing_id, {
          attributes: ["name"],
        });
        const listingName = listing?.name || "Tour";

        await Notification.create(
          {
            user_id,
            type: "info" as const,
            title: "Booking Request Submitted ✓",
            message: `Thank you, ${
              user?.name || "traveler"
            }! Your booking for "${listingName}" from ${new Date(
              start_date
            ).toLocaleDateString()} to ${new Date(
              end_date
            ).toLocaleDateString()} has been received and is pending approval.`,
            is_read: false,
          },
          { transaction: t }
        );

        // === 2. Notify OTHER ADMINS only (exclude the booker, even if they're admin) ===
        const admins = await User.findAll({
          where: {
            role: "admin",
            id: { [Op.ne]: user_id }, // ← Now works! Excludes the current user
          },
          attributes: ["id", "name"],
        });

        if (admins.length > 0) {
          const adminNotifications = admins.map((admin) => ({
            user_id: admin.id,
            type: "warning" as const,
            title: "New Booking Request 🚨",
            message: `New booking by ${
              user?.name || "a traveler"
            } for "${listingName}" (${new Date(
              start_date
            ).toLocaleDateString()}–${new Date(
              end_date
            ).toLocaleDateString()}) is awaiting review.`,
            is_read: false,
          }));

          await Notification.bulkCreate(adminNotifications, { transaction: t });
        }

        return createdBooking;
      });

      return res.status(201).json(result);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("Booking creation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
