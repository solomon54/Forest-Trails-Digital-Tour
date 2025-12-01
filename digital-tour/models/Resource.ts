import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import Listing from './Listing';

interface ResourceAttributes {
  id: number;
  listing_id: number;  // Snake FK matches DB
  type: 'image' | 'video';
  url: string;
  caption?: string;
  status: 'approved' | 'rejected';
  createdAt?: Date;  // Camel—maps to created_at
  updatedAt?: Date;
}

type ResourceCreationAttributes = Optional<ResourceAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> implements ResourceAttributes {
  public id!: number;
  public listing_id!: number;
  public type!: 'image' | 'video';
  public url!: string;
  public caption?: string;
  public status!: 'approved' | 'rejected';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Resource.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    listing_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: { type: DataTypes.ENUM('image', 'video'), allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    caption: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('approved', 'rejected'), defaultValue: 'approved' },
  },
  { 
    sequelize, 
    tableName: 'resources',  // Lowercase match for DB
    timestamps: true,
    underscored: true  // Maps camel JS → snake DB cols
  }
);

// Associations (in index.ts too)
Resource.belongsTo(Listing, { foreignKey: 'listing_id' });
Listing.hasMany(Resource, { foreignKey: 'listing_id', as: 'resources' });

export default Resource;