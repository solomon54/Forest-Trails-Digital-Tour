import type { NextApiRequest, NextApiResponse } from 'next';
import Listing from '../../../models/Listing';
import Resource from '../../../models/Resource';
import User from '../../../models/User';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    // --------------------------------------------
    // GET — Fetch all listings
    // --------------------------------------------
    if (method === 'GET') {
      const listings = await Listing.findAll({
        include: [
          { model: Resource },
          { model: User, attributes: ['id', 'name', 'photo_url'] }
        ],
        order: [['id', 'ASC']]
      });

      return res.status(200).json(listings);
    }

    // --------------------------------------------
    // POST — Create a new listing (with validation)
    // --------------------------------------------
    if (method === 'POST') {
      const { name, description, location, price, created_by } = req.body;

      // 1️⃣ Required fields
      if (!name || !location || !created_by) {
        return res.status(400).json({
          message: 'name, location, and created_by are required.'
        });
      }

      // 2️⃣ Validate price
      if (price == null || Number.isNaN(Number(price))) {
        return res.status(400).json({ message: 'price must be a valid number.' });
      }

      // 3️⃣ Create the listing
      const newListing = await Listing.create({
        name,
        description: description ?? null,
        location,
        price: Number(price),
        created_by
      });

      return res.status(201).json(newListing);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Error processing listings',
        error: err.message
      });
    }

    return res.status(500).json({ message: 'Unknown error' });
  }
}
