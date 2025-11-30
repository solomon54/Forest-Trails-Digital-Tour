import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import User from './User';
import Listing from './Listing';

interface ReviewAttributes {
  id: number;
  user_id: number;
  listing_id: number;
  rating: number;
  comment?: string;
  user_photo?: string;
  created_At?: Date;
  updated_At?: Date;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id' | 'comment' | 'user_photo' | 'created_At' | 'updated_At'>

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public user_id!: number;
  public listing_id!: number;
  public rating!: number;
  public comment?: string;
  public user_photo?: string;

  public readonly created_At!: Date;
  public readonly updated_At!: Date;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    listing_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    user_photo: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: 'reviews', timestamps: true }
);

// Relationships
Review.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Review, { foreignKey: 'user_id' });

Review.belongsTo(Listing, { foreignKey: 'listing_id' });
Listing.hasMany(Review, { foreignKey: 'listing_id' });

export default Review;
