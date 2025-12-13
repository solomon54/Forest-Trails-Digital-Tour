// pages/api/admin/resources/resource.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { Resource } from "@/models";
import { ResourceAttributes } from "@/models/Resource";
import { sequelize } from "@/lib/db";

interface AuthPayload {
  id: number;
  role: "admin" | "user";
}

interface ResourceQuery {
  status?: ResourceAttributes["status"];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = verifyToken(token) as AuthPayload;
    if (payload.role !== "admin")
      return res.status(403).json({ message: "Admin required" });

    await sequelize.authenticate();

    if (req.method !== "GET") return res.status(405).end();

    const { status } = req.query as ResourceQuery;
    const where: Partial<ResourceAttributes> = status ? { status } : {};

    // First: fetch with current locks
    let resources = await Resource.findAll({
      where,
      order: [["created_at", "ASC"]],
    });

    // Auto-unlock expired ones
    const now = new Date();
    const expired = resources.filter(
      (r) => r.locked_by && r.lock_expires_at && now > r.lock_expires_at
    );

    if (expired.length > 0) {
      const expiredIds = expired.map((r) => r.id);

      await Resource.update(
        {
          locked_by: null,
          locked_at: null,
          lock_expires_at: null,
        
        },
        { where: { id: expiredIds } }
      );

      console.log(`Auto-unlocked ${expired.length} expired resources`);

      // Refetch only the unlocked ones + return clean list
      const [unlocked, stillLocked] = await Promise.all([
        Resource.findAll({ where: { id: expiredIds } }),
        Resource.findAll({ where: { id: { [require("sequelize").Op.notIn]: expiredIds }, ...where } }),
      ]);

      resources = [...stillLocked, ...unlocked];
    }

    return res.status(200).json(resources);
  } catch (err) {
    console.error("admin resources list error", err);
    return res.status(500).json({ message: "Server error" });
  }
}