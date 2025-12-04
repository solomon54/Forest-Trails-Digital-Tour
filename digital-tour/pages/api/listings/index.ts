//api/listings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Listing, Resource, User } from '../../../models';

import { sequelize } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  try {
    // Ideally, ensure your db connection logic in lib/db handles this.
    // Explicit authentication on every request can be slow, but keeping it if that's your setup.
    await sequelize.authenticate();

    // ---------------------------------------------------------
    // MERGED GET HANDLER
    // ---------------------------------------------------------
    if (method === 'GET') {
      const { status } = req.query;

      // 1. Build the Main Listing Filter
      // If ?status=approved is passed, filter listings. Otherwise, get all.
      const listingWhere = status === 'approved' ? { status: 'approved' } : {};

      // 2. Build the Resource Filter
      // Usually, if a listing is public, you only want 'approved' photos shown.
      // Adjust this logic based on your needs.
      const resourceWhere = status === 'approved' ? { status: 'approved' } : {};

      const listings = await Listing.findAll({
        where: listingWhere,
        include: [
          { 
            model: Resource, 
            as: 'resources', 
            attributes: ['id', 'type', 'url', 'caption', 'status', 'created_at'], 
            where: resourceWhere, // Apply filter to resources too
            required: false // LEFT JOIN: Load listing even if it has no resources
          },
          { 
            model: User, as: 'creator', 
            attributes: ['id', 'name', 'photo_url'] 
          }
        ],
        // Usually you want the newest listings first (DESC), not oldest (ASC)
        order: [['created_at', 'DESC']] 
      });

      return res.status(200).json(listings);
    }

    // ---------------------------------------------------------
    // POST HANDLER
    // ---------------------------------------------------------
    if (method === 'POST') {
      const { name, description, location, price, created_by } = req.body;

      if (!name || !location || !created_by) {
        return res.status(400).json({
          message: 'name, location, and created_by are required.'
        });
      }

      if (price == null || Number.isNaN(Number(price))) {
        return res.status(400).json({ message: 'price must be a valid number.' });
      }

      const newListing = await Listing.create({
        name,
        description: description ?? null,
        location,
        price: Number(price),
        created_by
      });

      return res.status(201).json(newListing);
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${method} not allowed` });

  } catch (err: unknown) {
    console.error(err); // Good to log the error on the server console
    if (err instanceof Error) {
      return res.status(500).json({
        message: 'Error processing listings',
        error: err.message
      });
    }
    return res.status(500).json({ message: 'Unknown error' });
  }
}