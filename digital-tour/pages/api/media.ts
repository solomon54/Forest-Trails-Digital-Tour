import { DataTypes, Model, Optional } from 'sequelize';
import Sequelize from 'sequelize';
import { User } from '@/models';

interface MediaAttributes {
  id: number;
  url: string;
  public_id: string;
  type: 'image' | 'video';
  uploaded_by: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type MediaCreationAttributes = Optional<MediaAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Media extends Model<MediaAttributes, MediaCreationAttributes> implements MediaAttributes {
  public id!: number;
  public url!: string;
  public public_id!: string;
  public type!: 'image' | 'video';
  public uploaded_by!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Media.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.TEXT, allowNull: false },
    public_id: { type: DataTypes.STRING(255), allowNull: false },
    type: { type: DataTypes.ENUM('image', 'video'), allowNull: false },
    uploaded_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    tableName: 'media',
    timestamps: true,
    underscored: true  // Snake_case for created_at etc.
  }
);

// Associations (add to index.ts)
Media.belongsTo(User, { foreignKey: 'uploaded_by' });
User.hasMany(Media, { foreignKey: 'uploaded_by', as: 'media' });

export default Media;