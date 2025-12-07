// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import UserModel from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = verifyToken(token) as { id: number };

    const user = await UserModel.findByPk(payload.id, {
      attributes: ['id', 'name', 'email', 'role', 'photo_url', 'created_at']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ user });
  } catch (err) {
    console.error('ME endpoint error', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
