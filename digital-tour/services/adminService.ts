// services/adminService.ts
import apiClient from "./apiClient";
import { Resource } from "@/types/admin";

export const adminService = {
  async getPendingResources(): Promise<Resource[]> {
    const res = await apiClient.get<Resource[]>("/admin/resources?status=pending");
    return res.data;
  },

  async approveResource(id: number, updates?: { caption?: string; description?: string }) {
    // PATCH to update status and optional fields
    const res = await apiClient.put<Resource>(`/admin/resources/${id}`, {
      status: "approved",
      ...updates,
    });
    return res.data;
  },

  async rejectResource(id: number, reason?: string) {
    const res = await apiClient.put<Resource>(`/admin/resources/${id}`, {
      status: "rejected",
      reason: reason ?? null,
    });
    return res.data;
  },

  async getResource(id: number) {
    const res = await apiClient.get<Resource>(`/admin/resources/${id}`);
    return res.data;
  }
};




/*// services/adminService.ts
import apiClient from './apiClient';
import { Resource, Listing } from '@/types/admin';

export const adminService = {
  // Resources
  getPendingResources: async (): Promise<Resource[]> => {
    const res = await apiClient.get('/resources?status=pending');
    return res.data;
  },

  getResourceById: async (id: number): Promise<Resource> => {
    const res = await apiClient.get(`/resources/${id}`);
    return res.data;
  },

  approveResource: async (id: number, updates?: Partial<Resource>) => {
    const res = await apiClient.put(`/resources/${id}`, { status: 'approved', ...updates });
    return res.data;
  },

  rejectResource: async (id: number, reason?: string) => {
    // include reason if your API supports it (admin audit)
    const res = await apiClient.put(`/resources/${id}`, { status: 'rejected', reason });
    return res.data;
  },

  // Listings admin operations
  getAllListings: async (): Promise<Listing[]> => {
    const res = await apiClient.get('/listings');
    return res.data;
  },

  updateListing: async (id: number, payload: Partial<Listing>) => {
    const res = await apiClient.put(`/listings/${id}`, payload);
    return res.data;
  },

  // audit log endpoint (optional)
  createAdminAudit: async (payload: any) => {
    const res = await apiClient.post('/admin/audits', payload);
    return res.data;
  }
};
*/

