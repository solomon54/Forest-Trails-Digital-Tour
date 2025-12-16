// models/index.ts
import { sequelize } from '@/lib/db';

import User from './User';
import Listing from './Listing';
import Resource from './Resource';
import Review from './Review';
import Booking from './Booking';
import Notification from './Notification';
import Media from './Media';

import { applyAssociations } from './Association';
import BookingContact from './BookingContact';


// Run associations AFTER all models are imported
applyAssociations();

export {
  sequelize,
  User,
  Listing,
  Resource,
  Review,
  Booking,
  BookingContact,
  Notification,
  Media
};

