// services/adminService.ts
import apiClient from "./apiClient";
import { Resource } from "@/types/admin";

// =============================
// 1. Main Admin Service (Recommended way)
// =============================
export const adminService = {
  // Fetch all pending resources
  async getPendingResources(): Promise<Resource[]> {
    const res = await apiClient.get<Resource[]>("/admin/resources?status=pending");
    return res.data;
  },

  // Get single resource (any status)
  async getResource(id: number): Promise<Resource> {
    const res = await apiClient.get<Resource>(`/admin/resources/${id}`);
    return res.data;
  },

  // Approve with optional edits
  async approveResource(
    id: number,
    updates?: {
      caption?: string;
      description?: string;
      location?: string;
      price?: number;
    },
    adminId?: number
  ): Promise<Resource> {
    const res = await apiClient.put<Resource>(`/admin/resources/${id}`, {
      status: "approved",
      adminId,
      ...updates,
    });
    return res.data;
  },

  // Reject with mandatory reason (min 10 chars)
  async rejectResource(id: number, reason: string, adminId?: number): Promise<Resource> {
    if (!reason || reason.trim().length < 10) {
      throw new Error("Rejection reason must be at least 10 characters long");
    }

    const res = await apiClient.put<Resource>(`/admin/resources/${id}`, {
      status: "rejected",
      rejection_reason: reason,
      adminId,
    });
    return res.data;
  },
};

// =============================
// 2. Resource Locking (consistent + safe)
// =============================
export const lockResource = async (id: number, adminId: number) => {
  const res = await apiClient.post(
    `/admin/resources/${id}?action=lock`,
    {},
    { headers: { "x-admin-id": String(adminId) } }
  );
  return res.data;
};

export const unlockResource = async (id: number, adminId: number) => {
  const res = await apiClient.post(
    `/admin/resources/${id}?action=unlock`,
    {},
    { headers: { "x-admin-id": String(adminId) } }
  );
  return res.data;
};

// =============================
// 3. Admin Listings CRUD + Locking (now consistent!)
// =============================
export const adminListingService = {
  async getAll(filter?: string) {
    const res = await apiClient.get("/admin/listings", { params: { filter } });
    return res.data;
  },

  async lock(id: number, adminId: number) {
    const res = await apiClient.post(
      `/admin/listings/${id}/lock`,
      {},
      { headers: { "x-admin-id": String(adminId) } }
    );
    return res.data;
  },

  async unlock(id: number, adminId: number) {
    const res = await apiClient.post(
      `/admin/listings/${id}/unlock`,
      {},
      { headers: { "x-admin-id": String(adminId) } }
    );
    return res.data;
  },

  async update(id: number, updates: unknown) {
    const res = await apiClient.put(`/admin/listings/${id}`, updates);
    return res.data;
  },

  async delete(id: number) {
    const res = await apiClient.delete(`/admin/listings/${id}`);
    return res.data;
  },
};

// =============================
// 4. Bonus: Tiny helper if you really need it elsewhere
// =============================
export type ResourceStatus = "approved" | "rejected";
