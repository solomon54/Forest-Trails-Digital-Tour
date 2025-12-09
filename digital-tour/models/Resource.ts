//models/Resource.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/lib/db";

export interface ResourceAttributes {
  id: number;
  listing_id: number;
  type: "image" | "video";
  url: string;
  caption?: string | null;
  description?: string | null;
  rejection_reason?: string | null;
  locked_by?: number | null;
  locked_at?: Date | null;
  status: "pending" | "approved" | "rejected";
  created_at?: Date;
  updated_at?: Date;
}

// For creation where id is auto-generated
export type ResourceCreationAttributes = Optional<
  ResourceAttributes,
  "id" | "caption" | "description" | "rejection_reason" | "locked_by" | "locked_at" | "status"
>;

export class ResourceModel
  extends Model<ResourceAttributes, ResourceCreationAttributes>
  implements ResourceAttributes
{
  declare id: number;  // Use 'declare' instead of 'public !' to avoid shadowing
  declare listing_id: number;
  declare type: "image" | "video";
  declare url: string;
  declare caption: string | null;
  declare description: string | null;
  declare rejection_reason: string | null;
  declare locked_by: number | null;
  declare locked_at: Date | null;
  declare status: "pending" | "approved" | "rejected";
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

ResourceModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    listing_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("image", "video"), allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    caption: { type: DataTypes.TEXT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    rejection_reason: { type: DataTypes.TEXT, allowNull: true },
    locked_by: { type: DataTypes.INTEGER, allowNull: true },
    locked_at: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
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
