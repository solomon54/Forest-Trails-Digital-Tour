//pages/api/bookings/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Booking, User, Listing, Notification } from '@/models';
import { sequelize } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid booking id' });
  }

  try {
    /* ===================== GET ===================== */
    if (method === 'GET') {
      const booking = await Booking.findByPk(id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
          { model: Listing, as: 'listing', attributes: ['id', 'name', 'location', 'price'] }
        ]
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      return res.status(200).json(booking);
    }

    /* ===================== PUT ===================== */
    if (method === 'PUT') {
      const { action, admin_id } = req.body;

      if (!action || !admin_id) {
        return res.status(400).json({ message: 'Missing action or admin_id' });
      }

      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      let newStatus: 'confirmed' | 'rejected' | 'cancelled';

      switch (action) {
        case 'confirm':
          newStatus = 'confirmed';
          break;
        case 'reject':
          newStatus = 'rejected';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          break;
        default:
          return res.status(400).json({ message: 'Invalid action' });
      }

      const updatedBooking = await sequelize.transaction(async (t) => {
        await booking.update(
          {
            status: newStatus,
            decided_by: admin_id,
            decided_at: new Date()
          },
          { transaction: t }
        );

        await Notification.create(
          {
            user_id: booking.user_id,
            type: newStatus === 'confirmed' ? 'success' : 'warning',
            title: `Booking ${newStatus}`,
            message: `Your booking has been ${newStatus}.`,
            is_read: 0
          },
          { transaction: t }
        );

        return booking;
      });

      return res.status(200).json(updatedBooking);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error processing booking' });
  }
}
