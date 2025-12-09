// pages/admin/resources/index.tsx
import { Suspense, lazy, useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { adminService } from '@/services/adminService';
import { Resource } from '@/types/admin';
import { useAuth } from '@/hooks/useAuth';

const ResourceCard = lazy(() => import('@/components/admin/ResourceCard'));
const ResourceModal = lazy(() => import('@/components/admin/ResourceModal'));

export default function AdminResources() {
  const { user, isAdmin, loading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [busy, setBusy] = useState(false);

  const fetchPending = async () => {
    try {
      const data = await adminService.getPendingResources();
      setResources(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && isAdmin) fetchPending();
  }, [user, isAdmin]);

  if (loading) return <AdminLayout>Loading auth...</AdminLayout>;
  if (!isAdmin) return <AdminLayout>Access denied.</AdminLayout>;

  const handleApprove = async (id: number, updates?: { 
    caption?: string; 
    description?: string; 
    location?: string; 
    price?: number 
  }) => {
    if (!user?.id) return;  // Guard: No admin ID

    setBusy(true);
    try {
      await adminService.approveResource(id, updates, user.id);  // Pass updates + adminId
      await fetchPending();  // Refresh list
      setSelected(null);
    } catch (err) {
      console.error('Approval failed:', err);
      // Optional: Show error toast/alert here
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (id: number, reason?: string) => {
    if (!user?.id || !reason) return;  // Guard: No admin ID or reason

    setBusy(true);
    try {
      await adminService.rejectResource(id, reason, user.id);  // Pass reason + adminId
      await fetchPending();  // Refresh list
      setSelected(null);
    } catch (err) {
      console.error('Rejection failed:', err);
      // Optional: Show error toast/alert here
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Pending Resources</h1>
      <div className="grid gap-4">
        <Suspense fallback={<div>Loading resources...</div>}>
          {resources.length === 0 ? (
            <div className="p-6 bg-white rounded-xl shadow text-center">No pending resources.</div>
          ) : (
            resources.map((r) => (
              <ResourceCard key={r.id} resource={r} onClick={() => setSelected(r)} />
            ))
          )}
          {selected && (
            <ResourceModal
              resource={selected}
              onApprove={handleApprove}
              onReject={handleReject}
              onClose={() => setSelected(null)}
              busy={busy}
            />
          )}
        </Suspense>
      </div>
    </AdminLayout>
  );
}