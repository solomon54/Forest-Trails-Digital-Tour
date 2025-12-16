import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/db';

export interface BookingAttributes {
  id: number;
  user_id: number;
  listing_id: number;
  start_date: Date;
  end_date: Date;

  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'telebirr' | 'cbe_chapa' | 'card';

  transaction_id?: string | null;
  decided_by?: number | null;
  decided_at?: Date | null;

  created_at?: Date;
  updated_at?: Date;
}

type BookingCreationAttributes = Optional<
  BookingAttributes,
  | 'id'
  | 'transaction_id'
  | 'decided_by'
  | 'decided_at'
  | 'created_at'
  | 'updated_at'
>;

class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public id!: number;
  public user_id!: number;
  public listing_id!: number;
  public start_date!: Date;
  public end_date!: Date;

  public status!: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  public payment_status!: 'pending' | 'paid' | 'failed' | 'refunded';
  public payment_method!: 'telebirr' | 'cbe_chapa' | 'card';

  public transaction_id?: string | null;
  public decided_by?: number | null;
  public decided_at?: Date | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },

    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    listing_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },

    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'rejected', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },

    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },

    payment_method: {
      type: DataTypes.ENUM('telebirr', 'cbe_chapa', 'card'),
      allowNull: false
    },

    transaction_id: { type: DataTypes.STRING, allowNull: true },
    decided_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    decided_at: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Booking;
