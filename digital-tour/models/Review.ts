import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../lib/db';
import User from './User';
import Listing from './Listing';

interface ReviewAttributes {
  id: number;
  user_id: number;
  listing_id: number;
  rating: number;
  comment?: string;
  user_photo?: string;
  created_at?: Date;
  updated_at?: Date;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id' | 'comment' | 'user_photo' | 'created_at' | 'updated_at'>;

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public user_id!: number;
  public listing_id!: number;
  public rating!: number;
  public comment?: string;
  public user_photo?: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    listing_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    rating: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    user_photo: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

// Associations with alias
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

Review.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });
Listing.hasMany(Review, { foreignKey: 'listing_id', as: 'reviews' });

export default Review;
