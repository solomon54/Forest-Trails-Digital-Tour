//api/reviews/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Review, User, Listing } from '@/models';
import {sequelize} from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    // -----------------------
    // GET — Fetch all reviews
    // -----------------------
    if (method === 'GET') {
      const reviews = await Review.findAll({
        include: [
          { model: User, as: 'reviewUser', attributes: ['id', 'name', 'photo_url'] },
          { model: Listing, as: 'reviewListing', attributes: ['id', 'name', 'location', 'price'] }
        ],
        order: [['id', 'ASC']]
      });

      return res.status(200).json(reviews);
    }

    // -----------------------
    // POST — Create a new review
    // -----------------------
    if (method === 'POST') {
      const { user_id, listing_id, rating, comment } = req.body;

      if (!user_id || !listing_id || !rating) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newReview = await Review.create({
        user_id,
        listing_id,
        rating,
        comment
      });

      return res.status(201).json(newReview);
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: 'Error processing review', error: err.message });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
