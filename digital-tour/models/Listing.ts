//models/Listing.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/lib/db';

// 1️⃣ Attributes interface
interface ListingAttributes {
  id: number;
  name: string;
  description?: string;
  location?: string;
  price?: number;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

// 2️⃣ Creation attributes
type ListingCreationAttributes = Optional<
  ListingAttributes,
  'id' | 'created_at' | 'updated_at'
>;

// 3️⃣ Model class
class Listing
  extends Model<ListingAttributes, ListingCreationAttributes>
  implements ListingAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public location?: string;
  public price?: number;
  public created_by!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// 4️⃣ Init
Listing.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: 'listings',
    timestamps: true,
    underscored: true, // maps created_at, updated_at
  }
);

export default Listing;
