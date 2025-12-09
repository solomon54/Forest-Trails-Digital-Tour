// pages/api/admin/resources/resource.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { Resource } from "@/models";
import { ResourceAttributes } from "@/models/Resource";
import { sequelize } from "@/lib/db";

// Type for JWT payload
interface AuthPayload {
  id: number;
  email: string;
  role: "admin" | "user";
  iat: number;
  exp: number;
}

// Typed query params
interface ResourceQuery {
  status?: ResourceAttributes["status"];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Authentication
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = verifyToken(token) as AuthPayload;
    if (payload.role !== "admin")
      return res.status(403).json({ message: "Admin required" });

    await sequelize.authenticate();

    // GET /admin/resources
    if (req.method === "GET") {
      const query = req.query as ResourceQuery;
      const where: Partial<ResourceAttributes> = {};

      if (query.status) {
        where.status = query.status;
      }

      const resources = await Resource.findAll({
        where,
        order: [["created_at", "ASC"]],
      });

      return res.status(200).json(resources);
    }

    return res.status(405).end();
  } catch (err) {
    console.error("admin resources index error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ message: "Server error", error: message });
  }
}
