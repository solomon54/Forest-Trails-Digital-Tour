import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db";

const Media = sequelize.define(
  "Media",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING, allowNull: false },
    public_id: { type: DataTypes.STRING, allowNull: false },
    type: {
      type: DataTypes.ENUM("image", "video", "file"),
      defaultValue: "image",
    },
    uploaded_by: { type: DataTypes.INTEGER, allowNull: false }, // user id
  },
  {
    tableName: "media",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Media;
