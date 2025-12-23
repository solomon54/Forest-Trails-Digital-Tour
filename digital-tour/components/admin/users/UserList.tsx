// components/admin/users/UserList.tsx
import { useState } from "react";
import { AdminUser } from "@/pages/admin/users";
import Link from "next/link";

interface Props {
  users: AdminUser[];
  renderActions: (user: AdminUser) => React.ReactNode;
}

export default function UserList({ users, renderActions }: Props) {
  const [tab, setTab] = useState<"users" | "admins">("users");

  // filter users dynamically
  const filtered = users.filter((u) =>
    tab === "users" ? u.role === "user" : u.role === "admin"
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <header className="px-4 sm:px-6 py-6  bg-emerald-700/10">
       <div className="flex justify-between">
         <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 ">
          User Management
        </h1>
          <span>  <Link href="/admin" className=" md:text-2xl text-blue-500 sm:text-sm ">Dashboard</Link></span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage access, roles, and admin privileges
        </p>
      
      </header>

      {/* TABS */}
      <div className="px-4 sm:px-6 mb-6  bg-emerald-700/10">
        <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-sm border ">
          {(["users", "admins"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all opacity-90 ${
                tab === t
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-blue-600/30"
              }`}
            >
              {t === "users" ? "Users" : "Admins"}
            </button>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <p className="px-4 sm:px-6 text-sm text-gray-500">
          No {tab === "users" ? "users" : "admins"} found.
        </p>
      )}

      {/* USER CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6 pb-10">
        {filtered.map((user) => {
          const name = user.name?.trim() || "?";
          const hasValidPhoto = typeof user.photo_url === "string" && user.photo_url.trim().length > 0;

          const initials = name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={user.id}
              className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* USER INFO */}
              <div className="flex gap-4">
                {hasValidPhoto ? (
                  <img
                    src={user.photo_url!}
                    alt={name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover bg-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm sm:text-base shrink-0">
                    {initials || "?"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{name}</h3>

                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Joined:</span>{" "}
                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-sm text-gray-600 mt-1 truncate">
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${user.email}`}
                      className="text-blue-600 hover:underline"
                      title={user.email}
                    >
                      {user.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2 mt-4 ">
                <span
                  className={`px-2.5 py-1 text-xs font-semibold p-1 rounded-md ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user.role === "admin" ? "Admin" : "User"}
                </span>

                {user.is_super_admin && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 p-1 rounded-md">
                    Super Admin
                  </span>
                )}
              </div>

              {/* ACTIONS */}
              <div className="pt-3 mt-4 border-t">{renderActions(user)}</div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
