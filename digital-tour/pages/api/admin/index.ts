// pages/api/admin/resources/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { Resource } from "@/models"; // ensure models/index exports Resource
import { sequelize } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Auth & role check
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const payload = verifyToken(token) as any;
    if (!payload?.role || payload.role !== "admin") return res.status(403).json({ message: "Admin required" });

    await sequelize.authenticate();

    if (req.method === "GET") {
      const status = (req.query.status as string) || undefined;
      const where: any = {};
      if (status) where.status = status;
      const resources = await Resource.findAll({
        where,
        order: [["created_at", "ASC"]],
      });
      return res.status(200).json(resources);
    }

    return res.status(405).end();
  } catch (err) {
    console.error("admin resources index error", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
}
