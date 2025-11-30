// models/index.ts
import sequelize from '../lib/db';

// import model definitions (these don't contain associations)
import Listing from './Listing';
import Resource from './Resource';
import Review from './Review'; // if present
import Booking from './Booking'; // if present
import User from './User'; // if present

// Apply associations in one place (after all models are loaded)
function applyAssociations() {
  // Listing <-> Resource
  Listing.hasMany(Resource, { foreignKey: 'listing_id', as: 'resources' });
  Resource.belongsTo(Listing, { foreignKey: 'listing_id', as: 'listing' });

  // If you have other relations, add them here:
  // Listing.hasMany(Review, { foreignKey: 'listing_id' });
  // Review.belongsTo(Listing, { foreignKey: 'listing_id' });
  // Booking.belongsTo(Listing, { foreignKey: 'listing_id' });
  // etc.
}

applyAssociations();



// Export models so other files import from here
export { sequelize, Listing, Resource, Review, Booking, User };
export default sequelize;
