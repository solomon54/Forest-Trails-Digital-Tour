//models/adminService.ts
import apiClient from "@/services/apiClient";
import { Resource } from "@/types/admin";

// --- Response type ---
interface ApiResponse {
  message: string;
  resource?: Resource;
}

// --- Payload for approve/update ---
interface ApprovePayload {
  caption?: string;
  description?: string;
  location?: string;
  price?: number;
  name?: string;
  [key: string]: string | number | undefined;
}

export const adminApi = {
  // Fetch pending resources
  fetchResources: (status = "pending") =>
    apiClient
      .get<{ data: Resource[] }>(`/admin/resources?status=${status}`)
      .then((res) => res.data.data),

  // --- LOCK / UNLOCK ---
  lock: (id: number, adminId: number): Promise<ApiResponse> =>
    apiClient
      .post(`/admin/resources/${id}?action=lock`, {}, { headers: { "x-admin-id": String(adminId) } })
      .then((res) => res.data),

  unlock: (id: number, adminId: number): Promise<ApiResponse> =>
    apiClient
      .post(`/admin/resources/${id}?action=unlock`, {}, { headers: { "x-admin-id": String(adminId) } })
      .then((res) => res.data),

  // --- APPROVE / REJECT (use PUT, backend expects adminId + status) ---
  approve: (id: number, payload: ApprovePayload, adminId: number): Promise<ApiResponse> =>
    apiClient
      .put(`/admin/resources/${id}`, { ...payload, status: "approved", adminId }, { headers: { "x-admin-id": String(adminId) } })
      .then((res) => res.data),

  reject: (id: number, reason: string, adminId: number): Promise<ApiResponse> =>
    apiClient
      .put(`/admin/resources/${id}`, { rejection_reason: reason, status: "rejected", adminId }, { headers: { "x-admin-id": String(adminId) } })
      .then((res) => res.data),

  // Generic update for any field
  update: (id: number, payload: Record<string, unknown>, adminId: number): Promise<ApiResponse> =>
    apiClient
      .put(`/admin/resources/${id}`, payload, { headers: { "x-admin-id": String(adminId) } })
      .then((res) => res.data),
};

// --- Convenience wrappers ---
export const lockResource = (id: number, adminId: number) => adminApi.lock(id, adminId);
export const unlockResource = (id: number, adminId: number) => adminApi.unlock(id, adminId);
export const approveResource = (id: number, payload: ApprovePayload, adminId: number) => adminApi.approve(id, payload, adminId);
export const rejectResource = (id: number, reason: string, adminId: number) => adminApi.reject(id, reason, adminId);
export const updateResource = (id: number, payload: Record<string, unknown>, adminId: number) => adminApi.update(id, payload, adminId);

