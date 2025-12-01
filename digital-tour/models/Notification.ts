import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';
import User from './User';

interface NotificationAttributes {
  id: number;
  user_id: number;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  readed: boolean;
  created_at?: Date;
  updated_at?: Date;
}


type NotificationCreationAttributes = Optional<NotificationAttributes, 'id' | 'readed' | 'created_at' | 'updated_at'>

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public user_id!: number;
  public type!: 'success' | 'info' | 'warning';
  public title!: string;
  public message!: string;
  public readed!: boolean;

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
    readed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

// Relationships
Notification.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

User.hasMany(Notification, {
  foreignKey: "user_id",
  as: "notifications"
});


export default Notification;
