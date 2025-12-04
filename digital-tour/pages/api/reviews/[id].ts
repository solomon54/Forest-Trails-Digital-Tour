// api/reviews/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Review, User, Listing } from '@/models';
import { sequelize } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method;

  // ENHANCED: Parse and validate ID
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Valid review ID is required' });
  }
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return res.status(400).json({ message: 'Invalid review ID' });
  }

  try {
    if (method === 'GET') {
      const review = await Review.findByPk(numericId, {  // FIXED: Use parsed number
        include: [
          { model: User, as: 'reviewUser', attributes: ['id', 'name', 'photo_url'] },
          { model: Listing, as: 'reviewListing', attributes: ['id', 'name'] }
        ]
      });

      if (!review) return res.status(404).json({ message: 'Review not found' });

      return res.status(200).json(review);
    }

    if (method === 'PUT') {
      const { rating, comment, user_photo } = req.body;

      // ENHANCED: Basic validation
      if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
      }

      const [updatedCount, updatedReview] = await Review.update(  // FIXED: Destructure to get instance
        {
          rating,
          comment,
          user_photo: user_photo ?? undefined  // Let Sequelize handle nulls
        },
        { where: { id: numericId }, returning: true }  // PostgreSQL/MySQL compat; use plain: true if needed
      );

      if (updatedCount === 0) {
        return res.status(404).json({ message: 'Review not found' });
      }

      return res.status(200).json(updatedReview[0]);  // Return updated instance
    }

    if (method === 'DELETE') {
      const deletedCount = await Review.destroy({ where: { id: numericId } });
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Review not found' });
      }
      return res.status(204).end();  // FIXED: No content
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err: unknown) {
    console.error('Review API Error:', err);  // Added logging
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Error processing review',
        error: err.message
      });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}