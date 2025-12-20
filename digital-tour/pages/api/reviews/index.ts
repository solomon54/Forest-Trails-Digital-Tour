// api/reviews/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Review, User } from '@/models';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// Small utility (can be moved to /utils/date.ts later)
function calculateRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return 'Unknown time';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Unknown time';

  const diffSeconds = Math.floor((Date.now() - parsed.getTime()) / 1000);
  if (diffSeconds < 60) return 'Just now';

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return `${Math.floor(diffHours / 24)}d ago`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ───────────────── GET ─────────────────
    if (req.method === 'GET') {
      const { listingId } = req.query;

      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);
      const offset = (page - 1) * limit;

      const { count, rows } = await Review.findAndCountAll({
        where: listingId ? { listing_id: listingId } : {},
        include: [
          { model: User, as: 'reviewUser', attributes: ['id', 'name', 'photo_url'] },
        ],
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      const data = rows.map((review) => {
        const json = review.toJSON();
        return {
          ...json,
          relativeTime: calculateRelativeTime(
            json.createdAt || json.created_at
          ),
        };
      });

      return res.status(200).json({
        data,
        meta: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          page,
        },
      });
    }

    // ───────────────── POST ─────────────────
    if (req.method === 'POST') {
      const token = getTokenFromRequest(req);
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      let decoded: any;
      try {
        decoded = verifyToken(token);
      } catch {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const { listing_id, rating, comment } = req.body;

      if (!listing_id || typeof listing_id !== 'number') {
        return res.status(400).json({ message: 'listing_id is required' });
      }

      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: 'Rating must be between 1 and 5' });
      }

      if (comment && comment.length > 1000) {
        return res
          .status(400)
          .json({ message: 'Comment is too long' });
      }

      const existing = await Review.findOne({
        where: { user_id: decoded.id, listing_id },
      });

      if (existing) {
        return res.status(409).json({ message: 'Already submitted' });
      }

      const review = await Review.create({
        user_id: decoded.id,
        listing_id,
        rating,
        comment,
      });

      return res.status(201).json({
        ...review.toJSON(),
        relativeTime: calculateRelativeTime(review.created_at),
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Reviews API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
