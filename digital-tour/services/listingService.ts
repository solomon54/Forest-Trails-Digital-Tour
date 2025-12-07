//service/listingService.ts
import apiClient from "./apiClient";
import { Listing } from "@/types/admin";

export const getAllListings = async (): Promise<Listing[]> => {
  const res = await apiClient.get("/listings");
  return res.data;
};

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