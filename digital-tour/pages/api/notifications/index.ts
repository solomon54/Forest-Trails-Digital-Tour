//api/notifications/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Notification, User } from '@/models';
import {sequelize} from '../../../lib/db';
// import { sendEmail } from "@/lib/email";
import { pusher } from "@/lib/pusher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const { userId, unread } = req.query;

      // Filter notifications by user and optionally unread
const where: { user_id?: number; is_read?: boolean } = {};

// Convert query params to proper types
if (userId) where.user_id = Number(userId);
if (unread === 'true') where.is_read = false;

const notifications = await Notification.findAll({
  where,
  order: [['created_at', 'DESC']],
  include: [
    { 
      model: User, as: 'notificationUser',
      attributes: ['id', 'name', 'photo_url'] 
    }
  ],
});


      return res.status(200).json(notifications);
    }

    if (method === 'POST') {
  const { user_id, type, title, message } = req.body;

  // 1️⃣ Create notification in DB
  const newNotification = await Notification.create({
    user_id,
    type,
    title,
    message,
    is_read: false,
  });

  // 2️⃣ Get user email
  const user = await User.findByPk(user_id);
  if (user?.email) {
    // 3️⃣ Send email
    await sendEmail(
      user.email,
      title,
      `<p>${message}</p>`
    );
  }

  // 4️⃣ Realtime push (per-user channel)
  await pusher.trigger(
    `private-user-${user_id}`,
    "new-notification",
    {
      id: newNotification.id,
      title,
      message,
      created_at: newNotification.created_at,
    }
  );

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
