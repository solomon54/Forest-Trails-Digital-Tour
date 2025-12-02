import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../lib/db';
import User from './User';
import Listing from './Listing';

interface BookingAttributes {
  id: number;
  user_id: number;
  listing_id: number;
  start_date: Date;
  end_date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_method: 'online' | 'manual';
  transaction_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

type BookingCreationAttributes = Optional<BookingAttributes, 'id' | 'transaction_id' | 'created_at' | 'updated_at'>

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public user_id!: number;
  public listing_id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public status!: 'pending' | 'confirmed' | 'cancelled';
  public payment_method!: 'online' | 'manual';
  public transaction_id?: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    listing_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false }, 
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
    payment_method: { type: DataTypes.ENUM('online','manual'), allowNull: false },
    transaction_id: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    underscored: true,         // maps snake_case in DB
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);


// Relationships with alias
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });

// Booking.ts
Booking.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });
Listing.hasMany(Booking, { foreignKey: 'listing_id', as: 'bookings' });


 
export default Booking;
