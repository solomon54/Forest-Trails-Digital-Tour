import type { NextApiRequest, NextApiResponse } from 'next';
import Review from '../../../models/Review';
import User from '../../../models/User';
import Listing from '../../../models/Listing';
import {sequelize} from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
if (method === 'GET') {
  const review = await Review.findByPk(id as string, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'photo_url'] },
      { model: Listing, as: 'listing', attributes: ['id', 'name'] }
    ]
  });

  if (!review) return res.status(404).json({ message: 'Review not found' });

  return res.status(200).json(review);
}

    if (method === 'PUT') {
      const { rating, comment, user_photo } = req.body;

      const review = await Review.findByPk(id as string);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      await review.update({
        rating,
        comment,
        user_photo: user_photo ?? review.user_photo
      });

      return res.status(200).json(review);
    }

    if (method === 'DELETE') {
      const review = await Review.findByPk(id as string);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      await review.destroy();
      return res.status(200).json({ message: 'Review deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Error processing review',
        error: err.message
      });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
