// pages/admin/resources/index.tsx (FINALIZED CODE)

import { Suspense, lazy, useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { adminService } from '@/services/adminService';
import { Resource } from '@/types/admin';
import { useAuth } from '@/hooks/useAuth';
import { lockResource, unlockResource } from '@/models/adminService'; 

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
  if (!isAdmin || !user?.id) return <AdminLayout>Access denied.</AdminLayout>;

  // --- Lock/Unlock Handlers ---
  const handleReviewClick = async (resource: Resource) => {
    // This initial check prevents unnecessary API calls if the client state is up-to-date
    if (resource.locked_by && resource.locked_by !== user.id) {
      console.warn(`Resource ${resource.id} is already locked by Admin ${resource.locked_by}.`);
      return;
    }

    setBusy(true); 
    try {
      await lockResource(resource.id, user.id); 
      
      const updatedResource = await adminService.getResource(resource.id);
      setSelected(updatedResource);
      
      await fetchPending(); // Success: refresh list to update lock badges

    } catch (err: any) {
      // 🔑 409 FIX: Log error, alert user, and refresh list to show correct lock status
      // console.error('Lock acquisition failed:', err); 
      alert(`This resource is locked by another admin.🚫`);
      await fetchPending(); 
      
      setSelected(null);
    } finally {
      setBusy(false);
    }
  };
  
  const handleUnlock = async (id: number) => {
    try {
      await unlockResource(id, user.id); 
      await fetchPending(); 
    } catch (err) {
      // 🔑 Log warning instead of error for expected 403 on redundant unlock
      console.warn('Unlock failed:', err); 
    }
  };

  // --- Modal Actions (Approve/Reject) ---
  const handleApprove = async (id: number, updates: any, adminId: number) => {  
    if (!adminId) return;
    setBusy(true);
    try {
      await adminService.approveResource(id, updates, adminId); 
      
      // 🔑 UI FIX: Optimistically remove approved resource from the list
      setResources(current => current.filter(r => r.id !== id)); 
      await fetchPending(); // Final refresh to ensure correctness

      // 🛑 403 FIX: Remove redundant client-side unlock, as server PUT handles lock release
      // if (selected?.locked_by === user.id) await handleUnlock(id); 

      setSelected(null);
    } catch (err) { 
      console.error('Approval failed:', err); 
      alert('Approval failed due to a server error or data conflict.');
    } finally { 
      setBusy(false); 
    }
  };

  const handleReject = async (id: number, reason: string | undefined, adminId: number) => {
    if (!adminId || !reason) return;
    setBusy(true);
    try {
      await adminService.rejectResource(id, reason, adminId);
      
      // 🔑 UI FIX: Optimistically remove rejected resource from the list
      setResources(current => current.filter(r => r.id !== id));
      await fetchPending(); // Final refresh to ensure correctness

      // 🛑 403 FIX: Remove redundant client-side unlock, as server PUT handles lock release
      // if (selected?.locked_by === user.id) await handleUnlock(id);

      setSelected(null);
    } catch (err) { 
      console.error('Rejection failed:', err); 
      alert('Rejection failed due to a server error or missing reason.');
    } finally { 
      setBusy(false); 
    }
  };

  // --- Modal Close Handler (Unchanged - Unlock must remain here) ---
const handleCloseModal = async () => {
  if (!selected) return;

  // Only unlock if current user owns the lock
  if (selected.locked_by === user.id) {
    try {
      await unlockResource(selected.id, user.id);
      await fetchPending(); // refresh list after unlock
    } catch (err) {
      console.warn('Unlock failed:', err);
    }
  }

  // Close modal anyway
  setSelected(null);
};

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Pending Resources</h1>
      <div className="grid gap-4">
        <Suspense fallback={<div>Loading resources...</div>}>
          {resources.length === 0 ? (
            <div className="p-6 bg-white rounded-xl shadow text-center">
              No pending resources.
            </div>
          ) : (
           resources.map((r) => (
              <ResourceCard 
                key={r.id} 
                resource={r} 
                onClick={handleReviewClick}
                currentUserId={user.id}  
                isAppBusy={busy} 
              />
            ))
          )}

          {selected && (
            <ResourceModal
              resource={selected}
              onApprove={handleApprove}
              onReject={handleReject}
              onClose={handleCloseModal}
              busy={busy}
              currentUserId={user.id}
            />
          )}
        </Suspense>
      </div>
    </AdminLayout>
  );
}