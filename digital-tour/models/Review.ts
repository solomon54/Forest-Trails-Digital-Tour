import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@/lib/db';

// 1️⃣ Attributes interface
interface ReviewAttributes {
  id: number;
  user_id: number;  // FK to User
  listing_id: number;  // FK to Listing
  rating: number;  // e.g., 1-5
  comment?: string;
  user_photo?: string;  // Optional, from prior PUT usage
  created_at?: Date;
  updated_at?: Date;
}

// 2️⃣ Creation attributes (exclude auto-generated)
type ReviewCreationAttributes = Optional<
  ReviewAttributes,
  'id' | 'created_at' | 'updated_at'
>;

// 3️⃣ Model class
class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: number;
  public user_id!: number;
  public listing_id!: number;
  public rating!: number;
  public comment?: string;
  public user_photo?: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// 4️⃣ Init
Review.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },  // Optional FK constraint
    },
    listing_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'listings', key: 'id' },  // Optional FK constraint
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },  // Enforce 1-5
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_photo: {
      type: DataTypes.STRING,  // e.g., URL
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'reviews',  // FIXED: Explicitly 'reviews' (not 'resources')
    timestamps: true,
    underscored: true,  // created_at, updated_at
  }
);

export default Review;