import { Listing, User } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ message: "Listing ID is required" });

  try {
    if (req.method === "GET") {
      const listing = await Listing.findOne({
        where: { id },
        include: [
          { model: User, as: 'creator', attributes: ['id', 'name', 'photo_url'] }
        ]
      });

      if (!listing) return res.status(404).json({ message: "Listing not found" });

      return res.status(200).json(listing);
    }

    if (req.method === "PUT") {
      const [updatedCount, updatedRows] = await Listing.update(req.body, {
        where: { id },
        returning: true
      });
      if (updatedCount === 0) return res.status(404).json({ message: "Listing not found" });
      return res.status(200).json(updatedRows[0]);
    }

    if (req.method === "DELETE") {
      const deleted = await Listing.destroy({ where: { id } });
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
