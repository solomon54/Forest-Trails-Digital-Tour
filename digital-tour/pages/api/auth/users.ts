// pages/api/auth/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { User, connectDB } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const users = await User.findAll({ attributes: ["id", "name", "email", "role", "created_at"] });
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
