// pages/admin/resources/index.tsx
import { Suspense, lazy, useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { adminService } from "@/services/adminService";
import { lockResource, unlockResource } from "@/models/adminService";
import { Resource } from "@/types/admin";
import { useAuth } from "@/hooks/useAuth";

const ResourceCard = lazy(() => import("@/components/admin/ResourceCard"));
const ResourceModal = lazy(() => import("@/components/admin/ResourceModal"));

export default function AdminResources() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [resources, setResources] = useState<Resource[]>([]);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending resources
  const fetchResources = async () => {
    if (!user || !isAdmin) return;

    try {
      setError(null);
      const data = await adminService.getPendingResources();
      setResources(data);
    } catch (err) {
      console.error("Failed to load pending resources:", err);
      setError("Failed to load resources. Please try again.");
    }
  };

  useEffect(() => {
    fetchResources();
  }, [user, isAdmin]);

  // Handle "Review" click → attempt to lock
  const handleReview = async (resource: Resource) => {
    if (isBusy) return;

    // Quick client-side guard
    if (resource.locked_by && resource.locked_by !== user?.id) {
      alert("This resource is currently being reviewed by another admin.");
      return;
    }

    setIsBusy(true);
    try {
      await lockResource(resource.id, user!.id);

      // Fetch fresh resource data (ensures latest state)
      const freshResource = await adminService.getResource(resource.id);
      setSelected(freshResource);
    } catch (err: any) {
      if (err?.status === 409 || err?.message?.includes("locked")) {
        alert("This resource was just locked by another admin.");
      } else {
        alert("Failed to open resource for review.");
      }
      await fetchResources(); // Sync UI with reality
    } finally {
      setIsBusy(false);
    }
  };

  // Handle modal close → unlock if owned
  const handleCloseModal = async () => {
    if (!selected || !user) return;

    if (selected.locked_by === user.id) {
      try {
        await unlockResource(selected.id, user.id);
      } catch (err) {
        console.warn("Failed to unlock resource on close:", err);
        // Non-critical — don't block UI
      }
    }

    setSelected(null);
    await fetchResources();
  };

  // Approve resource
  const handleApprove = async (id: number, updates: any) => {
    if (!user) return;
    setIsBusy(true);
    try {
      await adminService.approveResource(id, updates, user.id);

      // Optimistic removal
      setResources((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
    } catch (err) {
      alert("Failed to approve resource. It may have been modified by another admin.");
      await fetchResources();
    } finally {
      setIsBusy(false);
    }
  };

  // Reject resource
  const handleReject = async (id: number, reason: string) => {
    if (!user || !reason.trim()) return;
    setIsBusy(true);
    try {
      await adminService.rejectResource(id, reason.trim(), user.id);

      // Optimistic removal
      setResources((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
    } catch (err) {
      alert("Failed to reject resource. Please try again.");
      await fetchResources();
    } finally {
      setIsBusy(false);
    }
  };

  // Auth guards
  if (authLoading) {
    return <AdminLayout><div className="p-8 text-center">Loading...</div></AdminLayout>;
  }

  if (!user || !isAdmin) {
    return <AdminLayout><div className="p-8 text-center text-red-600">Access denied.</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pending Resources
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Review and approve/reject user-submitted tour listings.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Resources List */}
        <Suspense fallback={<div className="text-center py-8">Loading resources...</div>}>
          {resources.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No pending resources</p>
              <p className="text-sm text-gray-500 mt-1">
                All submissions have been processed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onClick={() => handleReview(resource)}
                  currentUserId={user.id}
                  isAppBusy={isBusy}
                />
              ))}
            </div>
          )}
        </Suspense>

        {/* Review Modal */}
        {selected && (
          <ResourceModal
            resource={selected}
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={handleCloseModal}
            busy={isBusy}
            currentUserId={user.id}
          />
        )}
      </div>
    </AdminLayout>
  );
}