// pages/api/admin/users/index.ts  
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }

  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let payload: any;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!payload.id) {
    return res.status(400).json({ message: "Malformed token" });
  }

  // Fetch current user to check role fresh from DB
  const currentUser = await User.findByPk(payload.id, {
    attributes: ["id", "role", "is_super_admin"],
  });

  if (!currentUser) {
    return res.status(401).json({ message: "User not found" });
  }

  // Allow access if role === "admin" (covers regular admins + super admins, since super admins also have role "admin")
  if (currentUser.role !== "admin") {
    return res.status(403).json({ message: "Access denied – administrators only" });
  }

  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "is_super_admin",
        "photo_url",
        "created_at",
        "updated_at",
      ],
      order: [["id", "ASC"]],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("GET /admin/users failed:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
}