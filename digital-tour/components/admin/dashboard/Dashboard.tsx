// components/admin/dashboard/Dashboard.tsx
import React from "react";
import DashboardHeader from "./DashboardHeader";
import StatsSection from "./StatsSection";
import ActivityFeed from "./ActivityFeed";
import QuickActionsPanel from "./QuickActionsPanel";
import DashboardSkeleton from "./DashboardSkeleton";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <DashboardHeader userName={user?.name} />

      <StatsSection />

      <div className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <ActivityFeed className="xl:col-span-2" />
        <QuickActionsPanel />
      </div>
    </div>
  );
}