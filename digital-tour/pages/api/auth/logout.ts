// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAuthCookie } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  clearAuthCookie(res);
  return res.status(200).json({ message: 'Logged out' });
}
