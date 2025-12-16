// pages/api/bookings/check-availability.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Booking } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { listing_id, start_date, end_date } = req.body;

    if (!listing_id || !start_date || !end_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if any booking overlaps
    const existingBooking = await Booking.findOne({
      where: {
        listing_id,
        start_date,
        end_date
      }
    });

    if (existingBooking) {
      return res.status(200).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
