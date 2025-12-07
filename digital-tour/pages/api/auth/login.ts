// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { signToken, setAuthCookie } from '@/lib/auth';
import { sequelize } from '@/lib/db';
import UserModel from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    await sequelize.authenticate();

    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const hashed = user.getDataValue('password') as string;
    const match = await bcrypt.compare(password, hashed);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // create token (pick fields you need)
    const payload = { id: user.getDataValue('id'), role: user.getDataValue('role') };
    const token = signToken(payload);

    // set cookie
    setAuthCookie(res, token);

    // return user without password
const safeUser = {
  id: user.getDataValue('id'),
  name: user.getDataValue('name'),
  email: user.getDataValue('email'),
  role: user.getDataValue('role'),
  photo_url: user.getDataValue('photo_url'),
  // created_at: user.getDataValue('created_at'),
};


    return res.status(200).json({ message: 'Logged in', user: safeUser });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
