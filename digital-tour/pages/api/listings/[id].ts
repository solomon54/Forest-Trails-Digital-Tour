import type { NextApiRequest, NextApiResponse } from 'next';
import Listing from '../../../models/Listing';
import Resource from '../../../models/Resource';
import User from '../../../models/User';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const listing = await Listing.findByPk(id as string, {
        include: [
          { 
            model: Resource, 
            as: 'resources',  // ← Key: Matches hasMany alias for JOIN
            attributes: ['id', 'type', 'url', 'caption', 'status', 'createdAt'],  // Camel maps to snake via underscored
            required: false  // LEFT JOIN: Handles no-resources gracefully
          },
          { 
            model: User, 
            attributes: ['id', 'name', 'photo_url'] 
          }
        ]
      });

      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      return res.status(200).json(listing);  // Now nests resources (e.g., Bahir Dar vids for mod queues)
    }

    if (method === 'PUT') {
      const { name, description, location, price } = req.body;
      const listing = await Listing.findByPk(id as string);

      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      await listing.update({ name, description, location, price });
      return res.status(200).json(listing);
    }

    if (method === 'DELETE') {
      const listing = await Listing.findByPk(id as string);

      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      await listing.destroy();
      return res.status(200).json({ message: 'Listing deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error processing request', error: err.message });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}