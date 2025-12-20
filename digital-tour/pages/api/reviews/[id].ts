// api/reviews/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Review, User, Listing } from '@/models';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Validate ID
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Valid review ID is required' });
  }

  const reviewId = Number(id);
  if (Number.isNaN(reviewId)) {
    return res.status(400).json({ message: 'Invalid review ID' });
  }

  try {
    // ───────────────── GET ─────────────────
    if (req.method === 'GET') {
      const review = await Review.findByPk(reviewId, {
        include: [
          { model: User, as: 'reviewUser', attributes: ['id', 'name', 'photo_url'] },
          { model: Listing, as: 'reviewListing', attributes: ['id', 'name'] },
        ],
      });

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      return res.status(200).json(review);
    }

    // ──────────────── AUTH (PUT / DELETE) ────────────────
    if (req.method === 'PUT' || req.method === 'DELETE') {
      const token = getTokenFromRequest(req);
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      let decoded: any;
      try {
        decoded = verifyToken(token);
      } catch {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Ownership check (future-proof: admins can bypass later)
      if (review.user_id !== decoded.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // ───────────────── PUT ─────────────────
      if (req.method === 'PUT') {
        const { rating, comment } = req.body;

        if (
          rating !== undefined &&
          (typeof rating !== 'number' || rating < 1 || rating > 5)
        ) {
          return res
            .status(400)
            .json({ message: 'Rating must be between 1 and 5' });
        }

        const updatePayload: Partial<{
          rating: number;
          comment: string;
        }> = {};

        if (rating !== undefined) updatePayload.rating = rating;
        if (comment !== undefined) updatePayload.comment = comment;

        await review.update(updatePayload);

        return res.status(200).json(review);
      }

      // ──────────────── DELETE ────────────────
      await review.destroy();
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Review API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
