import type { NextApiRequest, NextApiResponse } from 'next';
import Booking from '../../../models/Booking';
import Notification from '../../../models/Notification'; // ✅ important
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    await sequelize.authenticate();

    const booking = await Booking.findByPk(id as string);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (method === 'GET') {
      return res.status(200).json(booking);
    }

    if (method === 'PUT') {
      const { status, transaction_id } = req.body;

      // 1️⃣ Update the booking
      await booking.update({ status, transaction_id });

      // 2️⃣ Auto-create a notification for the user
      await Notification.create({
        user_id: booking.user_id,
        type: 'info',
        title: 'Booking Status Updated',
        message: `Your booking for listing #${booking.listing_id} is now "${status}".`,
        readed: false
      });

      return res.status(200).json(booking);
    }

    if (method === 'DELETE') {
      await booking.destroy();
      return res.status(200).json({ message: 'Booking deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error processing booking', error: err.message });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
