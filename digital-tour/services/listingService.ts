import apiClient from "./apiClient";

export const getAllListings = async () => {
  const res = await apiClient.get("/listings");
  return res.data;
};

export const getListingById = async (id: number) => {
  const res = await apiClient.get(`/listings/${id}`);
  return res.data;
};

export const createListing = async (data: any) => {
  const res = await apiClient.post("/listings", data);
  return res.data;
};

export const updateListing = async (id: number, data: any) => {
  const res = await apiClient.put(`/listings/${id}`, data);
  return res.data;
};

export const deleteListing = async (id: number) => {
  const res = await apiClient.delete(`/listings/${id}`);
  return res.data;
};
