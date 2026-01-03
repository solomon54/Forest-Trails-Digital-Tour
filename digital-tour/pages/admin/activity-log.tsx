//pages/admin/activity-log.tsx
import { useState, useEffect } from "react";
import useSWR from "swr";
import { io } from "socket.io-client";
import AdminLayout from "@/components/layout/AdminLayout";
import ActivitySearch from "@/components/admin/activity/ActivitySearch";
import ActivityList from "@/components/admin/activity/ActivityList";
import { ActivityPagination } from "@/components/admin/activity/ActivityPagination";
import {
  Activity,
  ActivityMeta,
} from "@/components/admin/activity/activity.types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ActivityLogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // store online status per userId
  const [userStatus, setUserStatus] = useState<Record<number, boolean>>({});

  const { data, error, isLoading, mutate } = useSWR<{
    activities: Activity[];
    meta: ActivityMeta;
  }>(
    `/api/admin/activity-log?page=${page}&limit=10&search=${encodeURIComponent(
      search
    )}`,
    fetcher,
    { keepPreviousData: true }
  );

  // Socket.io for real-time online/offline
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const socket = io("http://localhost:3000", {
      auth: { token },
    });

    socket.on("user:online", ({ userId }) => {
      setUserStatus((prev) => ({ ...prev, [userId]: true }));
    });

    socket.on("user:offline", ({ userId }) => {
      setUserStatus((prev) => ({ ...prev, [userId]: false }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Merge online status into activities for child components
  const activitiesWithStatus = data?.activities.map((act) => ({
    ...act,
    admin: {
      ...act.admin,
      isOnline: userStatus[act.admin.id] ?? false,
    },
  }));

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Activity Log
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track administrative actions across the system
          </p>
        </header>

        {/* Search */}
        <div className="mb-6 max-w-lg">
          <ActivitySearch
            onSearch={(v) => {
              setPage(1);
              setSearch(v);
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
            <p className="font-medium text-red-800">
              Failed to load activity log
            </p>
            <button
              onClick={() => mutate()}
              className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && !data && (
          <div className="flex flex-col items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mb-4" />
            <p className="text-gray-500">Loading activities...</p>
          </div>
        )}

        {/* Activity List */}
        {activitiesWithStatus && !isLoading && (
          <>
            <ActivityList activities={activitiesWithStatus} />

            {/* Pagination */}
            {data && data.meta.totalPages > 1 && (
              <ActivityPagination
                page={page}
                totalPages={data.meta.totalPages}
                onChange={setPage}
                loading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
