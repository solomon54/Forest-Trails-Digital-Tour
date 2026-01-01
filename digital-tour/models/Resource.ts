// models/Resource.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/db";

export interface ResourceAttributes {
  id: number;
  listing_id: number | null; // ← Now nullable
  uploaded_by: number | null; // ← Added from schema
  type: "image" | "video";
  url: string;
  caption?: string | null;
  description?: string | null;
  location?: string | null; // ← Added for your new location field
  rejection_reason?: string | null;
  locked_by?: number | null;
  locked_at?: Date | null;
  lock_expires_at?: Date | null; // ← Was missing in model
  status: "pending" | "approved" | "rejected";
  created_at?: Date;
  updated_at?: Date;
}

// Allow optional fields during creation
export type ResourceCreationAttributes = Optional<
  ResourceAttributes,
  | "id"
  | "caption"
  | "description"
  | "location"
  | "rejection_reason"
  | "locked_by"
  | "locked_at"
  | "lock_expires_at"
  | "status"
  | "listing_id"
  | "uploaded_by"
>;

export class ResourceModel
  extends Model<ResourceAttributes, ResourceCreationAttributes>
  implements ResourceAttributes
{
  declare id: number;
  declare listing_id: number | null;
  declare uploaded_by: number | null;
  declare type: "image" | "video";
  declare url: string;
  declare caption: string | null;
  declare description: string | null;
  declare location: string | null;
  declare rejection_reason: string | null;
  declare locked_by: number | null;
  declare locked_at: Date | null;
  declare lock_expires_at: Date | null;
  declare status: "pending" | "approved" | "rejected";
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

ResourceModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // ← Critical fix: now allows NULL
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    locked_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    locked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lock_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "resources",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ResourceModel;
