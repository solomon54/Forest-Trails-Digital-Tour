// pages/api/admin/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  let currentUser: any;
  try {
    currentUser = verifyToken(token);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  // === Only super admins can manage roles ===
  if (!currentUser.is_super_admin) {
    return res.status(403).json({ message: "Only super administrators can manage user roles" });
  }

  // === Parse and validate ID ===
  const idParam = req.query.id;
  const idStr = Array.isArray(idParam) ? idParam[0] : idParam;
  const userId = parseInt(idStr as string, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // === Fetch target user ===
  const user = await User.findByPk(userId, {
    attributes: [
      "id",
      "role",
      "is_super_admin",
    ],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  // === Parse body ===
  const { role: newRole, reason } = req.body as { role?: string; reason?: string };

  if (!newRole || typeof newRole !== "string") {
    return res.status(400).json({ message: "Role field is required" });
  }

  if (!["admin", "user"].includes(newRole)) {
    return res.status(400).json({ message: "Invalid role value", received: newRole });
  }

  // === Critical protection: never allow demoting a super admin ===
  if (newRole === "user" && user.is_super_admin) {
    return res.status(403).json({ message: "Cannot revoke privileges from a super administrator" });
  }

  // === Grant admin ===
  if (newRole === "admin") {
    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an administrator" });
    }
    user.role = "admin";
  }

  // === Revoke admin ===
  if (newRole === "user") {
    if (user.role !== "admin") {
      return res.status(400).json({ message: "User is not an administrator" });
    }

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return res.status(400).json({ message: "Reason is required when revoking privileges" });
    }

    user.role = "user";
  }

  // === Save and return the FULL updated user ===
  await user.save();

  const updatedUser = await User.findByPk(userId, {
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

  return res.status(200).json(updatedUser);
}