// services/listingService.ts

import apiClient from "./apiClient";
import { Listing } from "@/types/admin";

interface GetAllListingsParams {
  status?: string;
  // Add other optional parameters here
}

// Fixed function signature and implementation
export const getAllListings = async (params: GetAllListingsParams): Promise<Listing[]> => {
  // apiClient should handle serializing the params object into a query string
  // e.g., apiClient.get("/listings", { params: { status: 'active' } })
  const res = await apiClient.get("/listings", { params }); 
  return res.data;
};

// ... (other functions remain the same)
export const getListingById = async (id: number): Promise<Listing> => {
  const res = await apiClient.get(`/listings/${id}`);
  return res.data;
};

export const createListing = async (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'resources' | 'creator'> & { price: number }): Promise<Listing> => {  // FIXED: Accept number, backend stringifies
  const res = await apiClient.post("/listings", data);
  return res.data;
};

export const updateListing = async (id: number, data: Partial<Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'resources' | 'creator'>> & { price?: number }): Promise<Listing> => {
  const res = await apiClient.put(`/listings/${id}`, data);
  return res.data;
};

export const deleteListing = async (id: number): Promise<void> => {
  await apiClient.delete(`/listings/${id}`);
};