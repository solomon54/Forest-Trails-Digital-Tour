import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models"; // make sure User model is exported
import { sequelize } from "@/lib/db"; // reusable Sequelize connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    await sequelize.authenticate();

    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "created_at"]
    });

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
