import type { NextApiRequest, NextApiResponse } from 'next';
import Listing from '../../../models/Listing';
import Resource from '../../../models/Resource';
import User from '../../../models/User';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const listings = await Listing.findAll({
        include: [
          { 
            model: Resource, 
            as: 'resources',  // ← Key: Matches hasMany alias
            attributes: ['id', 'type', 'url', 'caption', 'status', 'createdAt'],  // Camel works with underscored: true
            required: false  // LEFT JOIN: Fault-tolerant if no resources
          },
          { 
            model: User, 
            attributes: ['id', 'name', 'photo_url'] 
          }
        ],
        order: [['createdAt', 'ASC']]  // Camel order maps to created_at
      });

      return res.status(200).json(listings);  // Now nests resources array (e.g., Addis with images/vids)
    }

    // Your POST block unchanged...
    if (method === 'POST') {
      const { name, description, location, price, created_by } = req.body;

      if (!name || !location || !created_by) {
        return res.status(400).json({
          message: 'name, location, and created_by are required.'
        });
      }

      if (price == null || Number.isNaN(Number(price))) {
        return res.status(400).json({ message: 'price must be a valid number.' });
      }

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