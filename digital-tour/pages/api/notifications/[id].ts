import type { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../models/Notification';
import {sequelize} from '../../../lib/db';
import { User } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    await sequelize.authenticate();

    // GET ALL notifications (or a single one if id is provided)
    if (method === 'GET') {
      if (id) {
        const notification = await Notification.findByPk(id as string, {
          include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'photo_url'] }
          ]
        });

        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        return res.status(200).json(notification);
      } else {
        const notifications = await Notification.findAll({
          include: [
  { model: User, as: "user", attributes: ['id', 'name', 'photo_url'] }
]

        });
        return res.status(200).json(notifications);
      }
    }

    // UPDATE a notification (mark as readed)
    if (method === 'PUT') {
      if (!id) return res.status(400).json({ message: 'Notification ID is required for update' });

      const notification = await Notification.findByPk(id as string);
      if (!notification) return res.status(404).json({ message: 'Notification not found' });

      await notification.update({ readed: true });
      return res.status(200).json(notification);
    }

    // DELETE a notification
    if (method === 'DELETE') {
      if (!id) return res.status(400).json({ message: 'Notification ID is required for delete' });

      const notification = await Notification.findByPk(id as string);
      if (!notification) return res.status(404).json({ message: 'Notification not found' });

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
