// types/admin.ts
export interface User {
  id: number;
  name: string;
  email?: string;
  role?: "user" | "admin";
  photo_url?: string | null;
}

export interface Resource {
  id: number;
  listing_id: number;
  type: "image" | "video";
  url: string;
  caption?: string | null;
  description?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;

  // Locking feature
  locked_by?: number | null;
  lock_expires_at?: string | null;
  locker?: { id: number; name: string } | undefined;

  // Relations from server
  user?: User | null;

  // For pending resources — data from the parent Listing
  listing?: {
    id: number;
    name?: string;
    location?: string | null;
    price?: number | null;
  } | null;

  // For approved resources — when server includes synced listing data directly on resource
  resourceListing?: {
    location?: string | null;
    price?: number | null;
  } | null;
}

export interface Listing {
  id: number;
  name: string;
  description?: string | null;
  location?: string | null;
  price?: number | null;
  url?: string | null;
  creator?: { id: number; name: string } | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;

  resources?: Resource[];
}
