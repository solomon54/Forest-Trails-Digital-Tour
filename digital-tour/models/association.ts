import Listing from "./Listing";
import Resource from "./Resource";
import Review from "./Review";
import Booking from "./Booking";
import User from "./User";

export function applyAssociations() {
  Listing.hasMany(Resource, { foreignKey: "listing_id" });
  Resource.belongsTo(Listing, { foreignKey: "listing_id" });

  Listing.hasMany(Review, { foreignKey: "listing_id" });
  Review.belongsTo(Listing, { foreignKey: "listing_id" });

  Listing.hasMany(Booking, { foreignKey: "listing_id" });
  Booking.belongsTo(Listing, { foreignKey: "listing_id" });

  Listing.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Listing, { foreignKey: 'created_by', as: 'listings' });

}
