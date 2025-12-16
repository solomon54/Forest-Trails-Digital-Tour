import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../lib/db';


interface NotificationAttributes {
  id: number;
  user_id: number;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  is_read: boolean;
  created_at?: Date;
  updated_at?: Date;
}


type NotificationCreationAttributes = Optional<NotificationAttributes, 'id' | 'is_read' | 'created_at' | 'updated_at'>

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public user_id!: number;
  public type!: 'success' | 'info' | 'warning';
  public title!: string;
  public message!: string;
  public is_read!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: { type: DataTypes.ENUM('success','info','warning'), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);


export default Notification;
