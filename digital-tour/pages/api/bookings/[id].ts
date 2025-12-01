import type { NextApiRequest, NextApiResponse } from 'next';
import Booking from '../../../models/Booking';
import User from '../../../models/User';
import Listing from '../../../models/Listing';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const booking = await Booking.findByPk(id as string, {
  include: [
    { model: User, attributes: ['id', 'name', 'email'] },
    { model: Listing, as: 'listing', attributes: ['id', 'name', 'location', 'price'] }
  ]
});


      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      return res.status(200).json(booking);  // e.g., TX1001 confirmed with nested user/listing
    }

    if (method === 'PUT') {
      const { status, transaction_id } = req.body;
      const booking = await Booking.findByPk(id as string);

      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      await booking.update({ status, transaction_id });
      return res.status(200).json(booking);
    }

    if (method === 'DELETE') {
      const booking = await Booking.findByPk(id as string);

      if (!booking) return res.status(404).json({ message: 'Booking not found' });

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