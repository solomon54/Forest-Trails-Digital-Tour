import User from './User';
import Listing from './Listing';
import Resource from './Resource';
import Review from './Review';
import Booking from './Booking';
import Notification from './Notification';
import { applyAssociations } from './Association';

// Apply all associations once
// applyAssociations();

// export { User, Listing, Resource, Review, Booking, Notification };

// ... existing imports ...
import Media from './Media';
import sequelize from 'sequelize/lib/sequelize';

// In applyAssociations():
User.hasMany(Media, { foreignKey: 'uploaded_by', as: 'media' });
Media.belongsTo(User, { foreignKey: 'uploaded_by', as: 'user' });

// Export
export { sequelize, User, Listing, Resource, Booking, Review, Notification, Media };