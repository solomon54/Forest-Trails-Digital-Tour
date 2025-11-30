import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import Listing from './Listing';

interface ResourceAttributes {
  id: number;
  listing_id: number;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  status?: 'approved' | 'rejected' | 'pending';
  createdAt?: Date;
  updatedAt?: Date;
}

type ResourceCreationAttributes = Optional<ResourceAttributes, 'id' | 'caption' | 'status' | 'createdAt' | 'updatedAt'>

class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> implements ResourceAttributes {
  public id!: number;
  public listing_id!: number;
  public type!: 'image' | 'video';
  public url!: string;
  public caption?: string;
  public status?: 'approved' | 'rejected' | 'pending';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Resource.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    listing_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: { type: DataTypes.ENUM('image','video'), allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    caption: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM('approved','rejected','pending'), defaultValue: 'pending' },
  },
  { sequelize, tableName: 'resources', timestamps: true }
);

// Relationships
Resource.belongsTo(Listing, { foreignKey: 'listing_id' });
Listing.hasMany(Resource, { foreignKey: 'listing_id' });

export default Resource;
