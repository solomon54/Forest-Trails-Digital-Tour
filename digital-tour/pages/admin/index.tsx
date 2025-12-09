// pages/admin/index.tsx
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/AdminLayout";

// Lazy load dashboard
const Dashboard = dynamic(() => import("@/components/admin/Dashboard"), {
  suspense: true,
});

// Skeleton UI (loading state)
function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-40 bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-300 rounded"></div>
      <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
    </div>
  );
}

export default function AdminPage() {
  const { loading, user, isAdmin } = useAuth();

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;
  if (!isAdmin) return <p>Access Denied</p>;

  return (
    <AdminLayout>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </AdminLayout>
  );
}
