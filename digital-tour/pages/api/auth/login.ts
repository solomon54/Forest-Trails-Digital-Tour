import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { Sequelize, DataTypes } from "sequelize";

// Connect to DB (reuse your db connection file)
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS || "<!sol@12>"!,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Define User model (reuse same as signup)
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
}, { tableName: "users", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.getDataValue("password"));
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Optional: return a token (JWT) here
    return res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
