import User from './User';
import Listing from './Listing';
import Resource from './Resource';
import Review from './Review';
import Booking from './Booking';
import Notification from './Notification';

export function applyAssociations() {
  // -----------------------------
  // Listings & Resources
  // -----------------------------
  Listing.hasMany(Resource, { foreignKey: 'listing_id', as: 'resources' });
  Resource.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });

  // -----------------------------
  // Listings & Reviews
  // -----------------------------
  Listing.hasMany(Review, { foreignKey: 'listing_id', as: 'reviews' });
  Review.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });

  // -----------------------------
  // Listings & Bookings
  // -----------------------------
  Listing.hasMany(Booking, { foreignKey: 'listing_id', as: 'bookings' });
  Booking.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });

  // -----------------------------
  // Users & Listings
  // -----------------------------
  Listing.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
  User.hasMany(Listing, { foreignKey: 'created_by', as: 'listings' });

  // -----------------------------
  // Users & Reviews
  // -----------------------------
  Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

  // -----------------------------
  // Users & Bookings
  // -----------------------------
  Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });

  // -----------------------------
  // Users & Notifications
  // -----------------------------
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
}
