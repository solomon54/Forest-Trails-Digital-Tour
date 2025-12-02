import type { NextApiRequest, NextApiResponse } from 'next';
import Booking from '../../../models/Booking';
import User from '../../../models/User';
import Listing from '../../../models/Listing';
import Notification from '../../../models/Notification'; // ✅ make sure this is here
import {sequelize} from '../../../lib/db'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();
if (method === 'GET') {
  const bookings = await Booking.findAll({
    include: [
      { model: User, as: 'user', attributes: ['id', 'name'] },
      { model: Listing, as: 'listing', attributes: ['id', 'name'] }
    ],
    order: [['id', 'ASC']]
  });

  return res.status(200).json(bookings);
}

if (method === 'POST') {
  const { user_id, listing_id, start_date, end_date, status, payment_method } = req.body;

  if (!user_id || !listing_id || !start_date || !end_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newBooking = await sequelize.transaction(async (t) => {
    const booking = await Booking.create({
      user_id,
      listing_id,
      start_date,
      end_date,
      status,
      payment_method
    }, { transaction: t });

    // 2️⃣ Auto-create a notification for the user
    await Notification.create({
      user_id,
      type: 'info',
      title: 'New Booking Created',
      message: `Your booking for listing #${listing_id} from ${start_date} to ${end_date} has been created.`,
      readed: false
    }, { transaction: t });

    return booking;
  });

  return res.status(201).json(newBooking);
}


    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Error processing bookings',
        error: err.message
      });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
