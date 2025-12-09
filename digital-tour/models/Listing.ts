// models/Listing.ts 
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/lib/db';

// 1️⃣ Attributes interface (add status)
interface ListingAttributes {
  id: number;
  url?: string;
  name: string;
  description?: string;
  location?: string;
  price?: number;
  status?: 'draft' | 'active';  // New: Tracks approval
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

// 2️⃣ Creation attributes
type ListingCreationAttributes = Optional<
  ListingAttributes,
  'id' | 'url' | 'status' | 'created_at' | 'updated_at'  // Add status
>;

// 3️⃣ Model class (add status)
class Listing
  extends Model<ListingAttributes, ListingCreationAttributes>
  implements ListingAttributes
{
  public id!: number;
  public url?: string;
  public name!: string;
  public description?: string;
  public location?: string;
  public price?: number;
  public status?: 'draft' | 'active';  // New
  public created_by!: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// 4️⃣ Init (add status field)
Listing.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    url: { type: DataTypes.TEXT, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    status: {  // New
      type: DataTypes.ENUM('draft', 'active'),
      defaultValue: 'draft',
      allowNull: false,
    },
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