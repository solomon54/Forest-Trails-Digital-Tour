import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import User from './User';

interface ListingAttributes {
  id: number;
  name: string;
  description?: string;
  location?: string;
  price?: number;
  created_by: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ListingCreationAttributes = Optional<ListingAttributes, 'id' | 'createdAt' | 'updatedAt'>

class Listing extends Model<ListingAttributes, ListingCreationAttributes> implements ListingAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public location?: string;
  public price?: number;
  public created_by!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Listing.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, tableName: 'listings', timestamps: true }
);

// Relationships
Listing.belongsTo(User, { foreignKey: 'created_by' });
User.hasMany(Listing, { foreignKey: 'created_by' });

export default Listing;