// models/Resource.ts
import { DataTypes } from "sequelize";
import { sequelize } from "@/lib/db";

const Resource = sequelize.define(
  "Resource",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    listing_id: { type: DataTypes.INTEGER, allowNull: false },

    type: { type: DataTypes.ENUM("image", "video"), allowNull: false },

    url: { type: DataTypes.TEXT, allowNull: false },

    caption: { type: DataTypes.TEXT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("approved", "rejected"),
      defaultValue: "approved",
    },
  },
  {
    tableName: "resources",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Resource;
