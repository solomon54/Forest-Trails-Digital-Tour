import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/db';

export interface BookingContactAttributes {
  id: number;
  booking_id: number;

  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone_number?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;

  created_at?: Date;
  updated_at?: Date;
}

type BookingContactCreationAttributes = Optional<
  BookingContactAttributes,
  'id' | 'created_at' | 'updated_at'
>;

class BookingContact
  extends Model<BookingContactAttributes, BookingContactCreationAttributes>
  implements BookingContactAttributes
{
  public id!: number;
  public booking_id!: number;

  public first_name?: string | null;
  public last_name?: string | null;
  public email?: string | null;
  public phone_number?: string | null;

  public address?: string | null;
  public city?: string | null;
  public state?: string | null;
  public zip?: string | null;
  public country?: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BookingContact.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },

    booking_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },

    first_name: DataTypes.STRING(100),
    last_name: DataTypes.STRING(100),
    email: DataTypes.STRING(255),
    phone_number: DataTypes.STRING(50),

    address: DataTypes.STRING(255),
    city: DataTypes.STRING(100),
    state: DataTypes.STRING(100),
    zip: DataTypes.STRING(20),
    country: DataTypes.STRING(100)
  },
  {
    sequelize,
    tableName: 'booking_contacts',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default BookingContact;
