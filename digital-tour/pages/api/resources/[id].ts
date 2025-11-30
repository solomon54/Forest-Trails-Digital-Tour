import type { NextApiRequest, NextApiResponse } from 'next';
import Resource from '../../../models/Resource';
import Listing from '../../../models/Listing';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const resource = await Resource.findByPk(id as string, {
        include: [{ model: Listing, attributes: ['id', 'name'] }],
      });
      if (!resource) return res.status(404).json({ message: 'Resource not found' });
      return res.status(200).json(resource);
    }

    if (method === 'PUT') {
      const { type, url, caption, status } = req.body;
      const resource = await Resource.findByPk(id as string);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      await resource.update({ type, url, caption, status });
      return res.status(200).json(resource);
    }

    if (method === 'DELETE') {
      const resource = await Resource.findByPk(id as string);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      await resource.destroy();
      return res.status(200).json({ message: 'Resource deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error processing resource', error: err.message });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
