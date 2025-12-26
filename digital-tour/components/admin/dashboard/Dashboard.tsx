// components/admin/dashboard/Dashboard.tsx
import React from "react";
import useSWR from "swr";
import DashboardHeader from "./DashboardHeader";
import StatsSection from "./StatsSection";
import ActivityFeed from "./ActivityFeed";
import QuickActionsPanel from "./QuickActionsPanel";
import DashboardSkeleton from "./DashboardSkeleton";
import { useAuth } from "@/hooks/useAuth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const {
    data,
    error,
    isLoading,
    mutate, // for manual refresh
  } = useSWR("/api/admin/dashboard", fetcher, {
    refreshInterval: 30000, // Auto-refresh every 30 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  // Loading state
  if (authLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <DashboardHeader userName={user?.name} />
        <div className="mt-12 p-6 sm:p-8 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-center">
          <p className="font-semibold">Failed to load dashboard data</p>
          <p className="text-sm mt-2">Please try again later or contact support.</p>
          <button
            onClick={() => mutate()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Success — real data!
  const { stats, recentActivity } = data;

  return (
  <div className="mx-auto max-w-7xl px-0 lg:px-8 pb-12">
    <DashboardHeader userName={user?.name} />

    <StatsSection stats={stats} />

    <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <ActivityFeed activities={recentActivity} className="lg:col-span-2" />
      <QuickActionsPanel />
    </div>
  </div>
);

}
