// pages/api/admin/listings/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Listing, User } from "@/models";
import { sequelize } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Verify admin
  const [adminUser] = await sequelize.query(
    `SELECT role FROM users WHERE id = ? LIMIT 1`,
    { replacements: [payload.id], type: QueryTypes.SELECT }
  );

  if (!adminUser || (adminUser as any).role !== "admin") {
    return res.status(403).json({ message: "Administrators only" });
  }

  try {
    const { page = "1", limit = "10", search = "" } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    let whereClause: any = {
      status: "active", // Only live listings
    };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: listings, count: total } = await Listing.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: "createdBy", attributes: ["id", "name"] },
        { model: User, as: "updatedBy", attributes: ["id", "name"] },
      ],
      order: [["updated_at", "DESC"]],
      limit: limitNum,
      offset,
    });

    return res.status(200).json({
      listings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Live listings API error:", error);
    return res.status(500).json({ message: "Failed to fetch live listings" });
  }
}