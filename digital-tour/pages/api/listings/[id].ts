// pages/api/listings/[id].ts

import { Listing, User, Resource, Review } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "Listing ID is required" });

  // 1. FIX: Parse the ID to ensure it's a number for the database query
  const listingId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
  if (isNaN(listingId)) return res.status(400).json({ message: "Invalid Listing ID format" });

  try {
    if (req.method === "GET") {
      // 2. FIX & FEATURE: Include Resources, Reviews, and filter by status
      const listing = await Listing.findOne({
        where: { id: listingId, status: 'active' }, // Only show ACTIVE listings
        include: [
          // 2a. Include Creator
          { model: User, as: 'creator', attributes: ['id', 'name', 'photo_url'] },
          
          // 2b. Include Resources (Media Gallery)
          { 
            model: Resource, 
            as: 'resources', 
            where: { status: 'approved' }, // Only approved media
            attributes: ['id', 'url', 'type', 'caption', 'created_at'],
            required: false // LEFT JOIN: Listing can exist without resources
          },
          
          // 2c. Include Reviews
          {
            model: Review,
            as: 'reviews',
            attributes: ['id', 'rating', 'comment', 'created_at'],
            required: false,
            include: [{
                model: User,
                as: 'reviewUser', // Alias from Association.ts
                attributes: ['id', 'name'],
            }]
          }
        ]
      });

      if (!listing) return res.status(404).json({ message: "Listing not found or is not active." });

      return res.status(200).json(listing);
    }

    // PUT and DELETE handlers are generally for ADMIN/OWNER use
    // For these, you should implement authentication and authorization checks here!
    if (req.method === "PUT") {
      // Security Note: You MUST check if the user is authenticated and is the listing owner/admin
      const [updatedCount, updatedRows] = await Listing.update(req.body, {
        where: { id: listingId },
        returning: true
      });
      if (updatedCount === 0) return res.status(404).json({ message: "Listing not found" });
      return res.status(200).json(updatedRows[0]);
    }

    if (req.method === "DELETE") {
      // Security Note: You MUST check if the user is authenticated and is the listing owner/admin
      const deleted = await Listing.destroy({ where: { id: listingId } });
      if (!deleted) return res.status(404).json({ message: "Listing not found" });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (err: unknown) {
    console.error("Listing API Error:", err);
    return res.status(500).json({ message: "Internal server error", error: (err as Error).message });
  }
}