// services/adminService.ts
import apiClient from "./apiClient";
import { Resource } from "@/types/admin";

export const adminService = {
  async getPendingResources(): Promise<Resource[]> {
    const res = await apiClient.get<Resource[]>("/admin/resources?status=pending");
    return res.data;
  },

  async approveResource(id: number, updates?: { caption?: string; description?: string; location?: string; price?: number; }, adminId?: number) {
    // PUT to update status and optional fields (legacy; consider migrating to POST)
    const res = await apiClient.put<Resource>(`/admin/resources/${id}`, {
      status: "approved",
      adminId,  // Pass to API for logging
      ...updates,
    });
    return res.data;
  },

  async rejectResource(id: number, reason?: string, adminId?: number) {
    if (!reason || reason.trim().length < 10) {
      throw new Error("Rejection reason must be at least 10 characters");
    }
    const res = await apiClient.put<Resource>(`/admin/resources/${id}`, {
      status: "rejected",
      rejection_reason: reason,  // Use correct field name for API
      adminId,  // Pass to API for logging
    });
    return res.data;
  },

  async getResource(id: number) {
    const res = await apiClient.get<Resource>(`/admin/resources/${id}`);
    return res.data;
  }
};


// NEW: Listing admin API
export async function getAllAdminListings(filter?: string) {
  const res = await apiClient.get(`/admin/listings`, {
    params: { filter }
  });
  return res.data;
}

export async function lockListing(id: number) {
  const res = await apiClient.post(`/admin/listings/${id}/lock`);
  return res.data;
}

export async function releaseLock(id: number) {
  const res = await apiClient.post(`/admin/listings/${id}/unlock`);
  return res.data;
}

export async function updateListing(id: number, updates: any) {
  const res = await apiClient.put(`/admin/listings/${id}`, updates);
  return res.data;
}

export async function deleteListing(id: number) {
  const res = await apiClient.delete(`/admin/listings/${id}`);
  return res.data;
}

// NEW: Resource status update
export async function updateResourceStatus(
  id: number,
  status: "approved" | "rejected"
) {
  const res = await apiClient.put(`/admin/resources/${id}`, { status });
  return res.data;
}

