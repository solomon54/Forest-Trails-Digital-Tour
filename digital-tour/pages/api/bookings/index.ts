//pages/api/bookings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Booking, Notification, User, Listing } from '@/models';
import { sequelize } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    /* ===================== GET ===================== */
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

    /* ===================== POST ===================== */
   if (method === 'POST') {
  const { user_id, listing_id, start_date, end_date, payment_method } = req.body;

  if (!user_id || !listing_id || !start_date || !end_date || !payment_method) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const booking = await sequelize.transaction(async (t) => {
    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      where: {
        listing_id,
        start_date,
        end_date
      },
      transaction: t
    });

    if (existingBooking) {
      throw new Error('This listing is already booked for the selected dates.');
    }

    const newBooking = await Booking.create(
      {
        user_id,
        listing_id,
        start_date,
        end_date,
        status: 'pending',
        payment_status: 'pending',
        payment_method
      },
      { transaction: t }
    );

    await Notification.create(
      {
        user_id,
        type: 'info',
        title: 'Booking Created',
        message: 'Your booking request has been sent and is awaiting approval.',
        is_read: 0
      },
      { transaction: t }
    );

    return newBooking;
  });

  return res.status(201).json(booking);
}


    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error processing bookings' });
  }
}
