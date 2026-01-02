// lib/db.ts
import { Sequelize, DataTypes } from "sequelize";
import fs from "fs";
import path from "path";

const sslCaPath = path.resolve(process.env.DB_SSL_CA || "./certs/ca.pem");

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS || "<!sol@12>",
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(sslCaPath),
      },
    },
    logging: console.log, // optional: shows SQL queries
  }
);

// Define User model
export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    photo_url: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Test connection
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync(); // Ensures tables exist
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};
