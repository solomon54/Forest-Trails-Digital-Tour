
// pages/admin/index.tsx
import { Suspense } from "react";
import { useRouter } from "next/router";  // Add for redirect
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
  const router = useRouter();

  if (loading) return <DashboardSkeleton />;
  if (!user) return null;
  if (!isAdmin) {
    router.push('/login');  // Redirect instead of static text
    return null;
  }

  return (
    <AdminLayout>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </AdminLayout>
  );
}