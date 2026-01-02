//api/resources/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Resource, Listing } from "@/models";
import { sequelize } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  try {
    await sequelize.authenticate();

    if (method === "GET") {
      const resources = await Resource.findAll({
        include: [
          {
            model: Listing,
            as: "resourceListing",
            attributes: ["id", "name", "location", "price"],
          },
        ],
        order: [["id", "ASC"]],
      });
      return res.status(200).json(resources);
    }

    if (method === "POST") {
      const { listing_id, type, url, caption, status, description } = req.body;

      // ENHANCED: Basic validation
      if (!listing_id || !type || !url) {
        return res.status(400).json({
          message: "listing_id, type, and url are required.",
        });
      }

      if (!["image", "video"].includes(type)) {
        return res
          .status(400)
          .json({ message: 'type must be "image" or "video".' });
      }

      const numericListingId = Number(listing_id); // Cast for safety
      if (isNaN(numericListingId)) {
        return res
          .status(400)
          .json({ message: "listing_id must be a valid number." });
      }

      const newResource = await Resource.create({
        listing_id: numericListingId,
        type,
        url,
        caption: caption ?? null, // Handle optional fields
        status: status ?? "approved", // Default from model
        description: description ?? null,
      });

      return res.status(201).json(newResource);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err: unknown) {
    console.error("Resources API Error:", err); // Added logging for debugging
    if (err instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error processing resources", error: err.message });
    }
    return res.status(500).json({ message: "Unknown error" });
  }
}
