// components/admin/users/UserList.tsx
import { useState } from "react";
import { AdminUser } from "@/pages/admin/users";

interface Props {
  users: AdminUser[];
  renderActions: (user: AdminUser) => React.ReactNode;
}

export default function UserList({ users, renderActions }: Props) {
  const [tab, setTab] = useState<"users" | "admins">("users");

  const filtered = users.filter((u) =>
    tab === "users" ? u.role === "user" : u.role === "admin"
  );

  const userCount = users.filter((u) => u.role === "user").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-8">
      {/* ================= Header ================= */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          User Management
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-2xl">
          Manage user roles, access levels, and admin privileges across the
          platform.
        </p>
      </div>

      {/* ================= Tabs ================= */}
      <div className="flex overflow-x-auto">
        <div className="inline-flex min-w-max rounded-xl bg-gray-100 p-1 shadow-sm">
          <button
            onClick={() => setTab("users")}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
              tab === "users"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Users ({userCount})
          </button>

          <button
            onClick={() => setTab("admins")}
            className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition ${
              tab === "admins"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Admins ({adminCount})
          </button>
        </div>
      </div>

      {/* ================= Empty State ================= */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">
            No {tab === "users" ? "users" : "admins"} found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {tab === "users"
              ? "All registered users will appear here."
              : "Admins with elevated privileges will appear here."}
          </p>
        </div>
      )}

      {/* ================= User Cards ================= */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((user) => {
            const name = user.name?.trim() || "Unnamed User";
            const hasPhoto =
              typeof user.photo_url === "string" &&
              user.photo_url.trim().length > 0;

            const initials = name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0].toUpperCase())
              .join("")
              .slice(0, 2);

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  {/* User Header */}
                  <div className="flex items-center gap-4 mb-5">
                    {hasPhoto ? (
                      <img
                        src={user.photo_url!}
                        alt={name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl ring-4 ring-gray-100">
                        {initials || "?"}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                        {name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Joined{" "}
                        {new Date(user.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="text-sm text-gray-600 mb-5 font-medium break-all">
                    Email:{" "}
                    <span className="text-indigo-500 hover:underline cursor-pointer">
                      {user.email}
                    </span>
                  </div>

                  {/* Role Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>

                    {user.is_super_admin && (
                      <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">
                        Super Admin
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-200 pt-4">
                    {renderActions(user)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
