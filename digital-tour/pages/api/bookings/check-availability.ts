// pages/api/bookings/check-availability.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Booking } from "@/models";
import { Op } from "sequelize";

type AvailabilityResponse = {
  available: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AvailabilityResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ available: false, message: "Method not allowed" });
  }

  try {
    const { listing_id, start_date, end_date } = req.body;

    // 1️⃣ Required fields
    if (!listing_id || !start_date || !end_date) {
      return res.status(400).json({
        available: false,
        message: "Missing required booking data."
      });
    }

    // 2️⃣ Normalize dates
    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3️⃣ Date validation
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        available: false,
        message: "Invalid date format."
      });
    }

    if (start.getTime() === end.getTime()) {
      return res.status(200).json({
        available: false,
        message: "Check-in and check-out cannot be the same day."
      });
    }

    if (start < today) {
      return res.status(200).json({
        available: false,
        message: "You cannot book dates in the past."
      });
    }

    if (end <= start) {
      return res.status(200).json({
        available: false,
        message: "End date must be after the start date."
      });
    }

    // 4️⃣ Overlap check
    const conflict = await Booking.findOne({
      where: {
        listing_id,
        [Op.and]: [
          { start_date: { [Op.lt]: end_date } },
          { end_date: { [Op.gt]: start_date } }
        ]
      }
    });

    if (conflict) {
      return res.status(200).json({
        available: false,
        message: "Those dates are already booked. Please choose another range."
      });
    }

    // 5️⃣ Success
    return res.status(200).json({ available: true });

  } catch (error) {
    console.error("Availability check failed:", error);
    return res.status(500).json({
      available: false,
      message: "Server error. Please try again later."
    });
  }
}
