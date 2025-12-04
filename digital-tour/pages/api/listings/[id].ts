// pages/api/listings/[id].ts
import { Listing, Resource, User } from "@/models";

import type { NextApiRequest, NextApiResponse } from "next";
// import Listing from "@/models/Listing";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Listing ID is required" });
  }

  try {
    if (req.method === "GET") {
  const listings = await Listing.findAll({
  include: [
    { model: Resource, as: 'resources'},
    { model: User,as:'creator' , attributes: ['id', 'name', 'photo_url'] } // Uses default alias?
  ]
});


      if (!listings) {
        return res.status(404).json({ message: "Listing not found" });
      }

      return res.status(200).json(listings);
    }

    if (req.method === "PUT") {
      const updated = await Listing.update(req.body, {
        where: { id },
      });

      return res.status(200).json({ message: "Listing updated", updated });
    }

    if (req.method === "DELETE") {
      await Listing.destroy({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (err) {
    console.error("Listing API Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
