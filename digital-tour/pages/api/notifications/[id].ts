import type { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../models/Notification';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    await sequelize.authenticate();

    const notification = await Notification.findByPk(id as string);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    if (method === 'GET') {
      return res.status(200).json(notification);
    }

    if (method === 'PUT') {
      // Mark as readed
      await notification.update({ readed: true });
      return res.status(200).json(notification);
    }

    if (method === 'DELETE') {
      await notification.destroy();
      return res.status(200).json({ message: 'Notification deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error processing notification', error: err.message });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
