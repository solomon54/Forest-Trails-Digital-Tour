// pages/api/booking_contacts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { BookingContact, Booking } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      booking_id,
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      country
    } = req.body;

    if (!booking_id || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 🔒 Ensure booking exists
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const contact = await BookingContact.create({
      booking_id,
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      country
    });

    return res.status(201).json(contact);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating booking contact' });
  }
}
