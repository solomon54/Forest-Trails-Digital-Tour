import type { NextApiRequest, NextApiResponse } from 'next';
import Resource from '../../../models/Resource';
import Listing from '../../../models/Listing';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const resources = await Resource.findAll({
        include: [{ model: Listing, attributes: ['id', 'name'] }],
        order: [['id', 'ASC']],
      });
      return res.status(200).json(resources);
    }

    if (method === 'POST') {
      const { listing_id, type, url, caption, status } = req.body;

      const newResource = await Resource.create({
        listing_id,
        type,
        url,
        caption,
        status,
      });

      return res.status(201).json(newResource);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error processing resources', error: err.message });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
