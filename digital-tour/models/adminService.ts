// services/adminService.ts
import apiClient from "@/services/apiClient";

export const adminApi = {
  fetchResources: (status = "pending") => apiClient.get(`/admin/resources?status=${status}`).then(r => r.data),
  lock: (id: number, adminId: number) => apiClient.post(`/admin/resources/${id}?action=lock`, {}, { headers: { "x-admin-id": String(adminId) } }).then(r => r.data),
  unlock: (id: number, adminId: number) => apiClient.post(`/admin/resources/${id}?action=unlock`, {}, { headers: { "x-admin-id": String(adminId) } }).then(r => r.data),
  approve: (id: number, adminId: number) => apiClient.post(`/admin/resources/${id}?action=approve`, {}, { headers: { "x-admin-id": String(adminId) } }).then(r => r.data),
  reject: (id: number, reason: string, adminId: number) => apiClient.post(`/admin/resources/${id}?action=reject`, { reason }, { headers: { "x-admin-id": String(adminId) } }).then(r => r.data),
  update: (id: number, payload: unknown, adminId: number) => apiClient.put(`/admin/resources/${id}`, payload, { headers: { "x-admin-id": String(adminId) } }).then(r => r.data),
};
