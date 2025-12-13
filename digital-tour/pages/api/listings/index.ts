// pages/api/listings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Listing, User } from '../../../models'; // Removed Resource import

import { sequelize } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    // ---------------------------------------------------------
    // GET HANDLER (Focus on Active Listings for Public View)
    // ---------------------------------------------------------
    if (method === 'GET') {
      const { status } = req.query;

      // 1. Build the Listing Filter: Only fetch 'active' listings for public display
      // If ?status=active is passed, filter. Otherwise, default to all listings (might include 'draft' for admin view).
      // For this public route, let's enforce 'active' status by default unless otherwise specified.
      const listingWhere = status === 'active' ? { status: 'active' } : {};
      
      // If no status query is present, we still want to limit to 'active' for the public.
      if (!status) {
        listingWhere.status = 'active'; 
      }


      const listings = await Listing.findAll({
        where: listingWhere,
        include: [
          // Removed the Resource join: Listing data is self-contained.
          { 
            model: User, as: 'creator', 
            attributes: ['id', 'name', 'photo_url'] 
          }
        ],
        attributes: [
            'id', 'name', 'url', 'description', 'location', 'price', 
            'cover_image_url', 'created_by', 'created_at', 'status'
        ],
        // Order by newest first
        order: [['created_at', 'DESC']] 
      });

      return res.status(200).json(listings);
    }

    // ---------------------------------------------------------
    // POST HANDLER (No changes)
    // ---------------------------------------------------------
    if (method === 'POST') {
      const { name, description, location, price, url, created_by } = req.body;

      if (!name || !location || !created_by) {
        return res.status(400).json({
          message: 'name, location, and created_by are required.'
        });
      }

      if (price == null || Number.isNaN(Number(price))) {
        return res.status(400).json({ message: 'price must be a valid number.' });
      }

      // NOTE: When a new listing is created, it should start as 'draft' 
      // as per your logic (it's pending admin approval/action).
      const newListing = await Listing.create({
        name,
        description: description ?? null,
        location,
        price: Number(price),
        url: url ?? null, // Added URL to the post
        created_by
        // status defaults to 'draft' in the model
      });

      return res.status(201).json(newListing);
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${method} not allowed` });

  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Error processing listings',
        error: err.message
      });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}