// models/Association.ts
import User from "./User";
import Listing from "./Listing";
import Resource from "./Resource";
import Review from "./Review";
import Booking from "./Booking";
import Notification from "./Notification";
import Media from "./Media";
import BookingContact from "./BookingContact";

export function applyAssociations() {

// Booking ↔ BookingContact
Booking.hasOne(BookingContact, {
  foreignKey: 'booking_id',
  as: 'contact'
});
BookingContact.belongsTo(Booking, {
  foreignKey: 'booking_id',
  as: 'booking'
});


  // Listings ↔ Resources
  Listing.hasMany(Resource, { foreignKey: "listing_id", as: "resources" });
  Resource.belongsTo(Listing, { foreignKey: "listing_id", as: "resourceListing" });

  // Listings ↔ Reviews
  Listing.hasMany(Review, { foreignKey: 'listing_id', as: 'reviews' });
  Review.belongsTo(Listing, { foreignKey: 'listing_id', as: 'reviewListing' });

  // Users ↔ Reviews
  Review.belongsTo(User, { foreignKey: 'user_id', as: 'reviewUser' });
  User.hasMany(Review, { foreignKey: 'user_id', as: 'userReviews' });

  // Listings ↔ Bookings
  Listing.hasMany(Booking, { foreignKey: 'listing_id', as: 'bookings' });
  Booking.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });

  // Users ↔ Bookings
  User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
  Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Users ↔ Notification
  User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
  Notification.belongsTo(User, { foreignKey: "user_id", as: "notificationUser" });

  // Users ↔ Media
  User.hasMany(Media, { foreignKey: "uploaded_by", as: "media" });
  Media.belongsTo(User, { foreignKey: "uploaded_by", as: "mediaUser" });

 // Users ↔ Listings
  Listing.belongsTo(User, { foreignKey: "created_by", as: "creator" });
User.hasMany(Listing, { foreignKey: "created_by", as: "userListings" });


// Users ↔ Resources (locking)
Resource.belongsTo(User, { foreignKey: "locked_by", as: "locker" });
User.hasMany(Resource, { foreignKey: "locked_by", as: "lockedResources" });

// Booking ↔ Admin (decided_by)
Booking.belongsTo(User, {
  foreignKey: 'decided_by',
  as: 'decider'
});
User.hasMany(Booking, {
  foreignKey: 'decided_by',
  as: 'decidedBookings'
});


}

