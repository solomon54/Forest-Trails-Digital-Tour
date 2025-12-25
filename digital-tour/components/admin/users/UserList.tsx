// components/admin/users/UserList.tsx
import { useState } from "react";
import { AdminUser } from "@/pages/admin/users"; // Adjust path if needed
import Link from "next/link";

interface Props {
  users: AdminUser[];
  renderActions: (user: AdminUser) => React.ReactNode;
}

export default function UserList({ users, renderActions }: Props) {
  const [tab, setTab] = useState<"users" | "admins">("users");

  const filtered = users.filter((u) =>
    tab === "users" ? u.role === "user" : u.role === "admin"
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage user roles, access, and admin privileges across the platform.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-sm">
          {(["users", "admins"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === t
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {t === "users" ? "Users" : "Admins"} ({users.filter(u => u.role === (t === "users" ? "user" : "admin")).length})
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
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

      {/* User Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((user) => {
            const name = user.name?.trim() || "Unnamed User";
            const hasValidPhoto = typeof user.photo_url === "string" && user.photo_url.trim().length > 0;
            const initials = name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0].toUpperCase())
              .join("")
              .slice(0, 2);

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* User Info Row */}
                  <div className="flex items-center gap-4 mb-5">
                    {hasValidPhoto ? (
                      
                      <img
                       src={user.photo_url}
                        alt={name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl ring-4 ring-gray-100">
                        {initials || "?"}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{name}</h3>
                     <p className="text-gray-400 text-sm">
                      <span className="font-medium ">Joined:</span>{" "}
                      {new Date(user.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p></div>
                  </div>

                   
                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-gray-600 mb-5 transition-all duration-300 font-medium">
                      <p>Email: <span className="text-indigo-400 cursor-pointer hover:text-indigo-500 text hover:underline">{user.email}</span></p>

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