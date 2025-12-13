// types/admin.ts
export interface User {
  id: number;
  name: string;
  email?: string;
  role?: 'user' | 'admin';
  photo_url?: string | null;
}

export interface Resource {
  locked_by: number;
  resourceListing: any;
  id: number;
  listing_id: number;
  type: 'image' | 'video';
  url: string;
  caption?: string | null;
  description?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  // optional relations that server may include
  user?: User | null;
  listing?: { id: number; name?: string } | null;
}

export interface Listing {
  url: Text;
  creator: string;
  id: number;
  name: string;
  description?: string | null;
  location?: string | null;
  price?: string | number | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
  resources?: Resource[];
}
