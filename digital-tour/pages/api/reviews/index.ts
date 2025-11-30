import type { NextApiRequest, NextApiResponse } from 'next';
import Review from '../../../models/Review';
import User from '../../../models/User';
import Listing from '../../../models/Listing';
import sequelize from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === 'GET') {
      const reviews = await Review.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'photo'] },
          { model: Listing, attributes: ['id', 'name'] }
        ],
        order: [['id', 'ASC']]
      });

      return res.status(200).json(reviews);
    }

if (method === 'POST') {
  const { user_id, listing_id, rating, comment } = req.body;

  // 1️⃣ Simple validation
  if (!user_id || !listing_id) {
    return res.status(400).json({ message: "user_id and listing_id are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  // 2️⃣ If valid → create
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
      return res.status(500).json({
        message: 'Error fetching or creating reviews',
        error: err.message
      });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}
