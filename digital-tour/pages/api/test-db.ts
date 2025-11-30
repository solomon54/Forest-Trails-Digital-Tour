import type { NextApiRequest, NextApiResponse } from 'next';
import sequelize from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await sequelize.authenticate();
    res.status(200).json({ message: '✅ MySQL Connected!' });
  } catch (err) {
    res.status(500).json({ message: '❌ Connection Failed', error: err });
  }
}
