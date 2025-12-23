// pages/api/auth/me.ts   
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Prevent any caching of this sensitive endpoint
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  let payload: any;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!payload.id || typeof payload.id !== "number") {
    return res.status(400).json({ message: "Malformed token: missing or invalid user ID" });
  }

  try {
    const user = await User.findByPk(payload.id, {
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
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
}