import type { NextApiRequest, NextApiResponse } from 'next';
import Notification from '../../../models/Notification';
import User from '../../../models/User';
import {sequelize} from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const { userId, unread } = req.query;

      // Filter notifications by user and optionally unread
const where: { user_id?: number; readed?: boolean } = {};

// Convert query params to proper types
if (userId) where.user_id = Number(userId);
if (unread === 'true') where.readed = false;

const notifications = await Notification.findAll({
  where,
  order: [['created_at', 'DESC']],
  include: [
    { 
      model: User, as: 'user',
      attributes: ['id', 'name', 'photo_url'] 
    }
  ],
});


      return res.status(200).json(notifications);
    }

    if (method === 'POST') {
      const { user_id, type, title, message } = req.body;

      const newNotification = await Notification.create({
        user_id,
        type,
        title,
        message,
        readed: false,
      });

      // Future: trigger email here
      // sendEmail(user_id, title, message);

      return res.status(201).json(newNotification);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error processing notifications', error: err.message });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
