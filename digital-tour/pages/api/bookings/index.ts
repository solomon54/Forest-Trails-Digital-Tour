// pages/api/bookings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Booking, Listing, BookingContact } from '@/models';
import { sequelize } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    /* ===================== GET (ADMIN) ===================== */
    if (req.method === 'GET') {
      const bookings = await Booking.findAll({
        include: [
          { model: Listing, as: 'listing', attributes: ['id', 'name', 'location'] },
          { model: BookingContact, as: 'contact' }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json(bookings);
    }

    /* ===================== POST (USER) ===================== */
    if (req.method === 'POST') {
      const {
        user_id,
        listing_id,
        start_date,
        end_date,
        payment_method,
        contact
      } = req.body;

      if (!user_id || !listing_id || !start_date || !end_date || !payment_method || !contact) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const booking = await sequelize.transaction(async (t) => {
        const createdBooking = await Booking.create(
          {
            user_id,
            listing_id,
            start_date,
            end_date,
            payment_method,
            status: 'pending',
            payment_status: 'pending'
          },
          { transaction: t }
        );

        await BookingContact.create(
          {
            booking_id: createdBooking.id,
            ...contact
          },
          { transaction: t }
        );

        return createdBooking;
      });

      return res.status(201).json(booking);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
