export interface Booking {
  id: number;
  user_id: number;
  listing_id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  payment_method: 'telebirr' | 'cbe_chapa' | 'card';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_id?: string;
  user: {
    id: number;
    name: string;
    email?: string;
  };
  listing: {
    id: number;
    name: string;
    location?: string;
    price?: number;
  };
}
