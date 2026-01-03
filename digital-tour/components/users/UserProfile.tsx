import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/router";
import { BellIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

export default function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, loading, readOne } = useNotifications(
    user?.id,
    "user"
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/Login");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "").toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    /* CHANGE: Switched from fixed to relative to sit inside the Navbar's flexbox */
    <div
      ref={menuRef}
      className="relative z-50 flex items-center gap-2 sm:gap-3">
      {/* --- NOTIFICATION SECTION --- */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNotifs(!showNotifs);
            setShowProfile(false);
          }}
          className={`relative p-2 sm:p-2.5 rounded-full transition border ${
            showNotifs
              ? "bg-slate-500 border-white/40 shadow-inner"
              : "bg-white/10 border-white/10 hover:bg-white/20"
          }`}>
          <BellIcon
            className={`h-5 w-5 sm:h-6 sm:w-6 ${
              showNotifs ? "text-emerald-300" : "text-white"
            }`}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-indigo-600">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <div className="fixed sm:absolute top-16 sm:top-12 left-4 right-4 sm:left-auto sm:right-0 sm:w-80 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Updates
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>

            <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400 text-sm italic">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No new updates
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.slice(0, 5).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (!n.is_read) readOne(n.id);
                        router.push("/notifications");
                        setShowNotifs(false);
                      }}
                      className={`w-full text-left px-4 py-4 hover:bg-emerald-50 transition ${
                        !n.is_read ? "bg-emerald-50/30" : ""
                      }`}>
                      <p
                        className={`text-sm leading-tight ${
                          !n.is_read
                            ? "font-semibold text-emerald-900"
                            : "text-gray-700"
                        }`}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {n.created_at
                          ? formatDistanceToNow(new Date(n.created_at), {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                router.push("/notifications");
                setShowNotifs(false);
              }}
              className="w-full py-4 text-center text-xs font-bold text-emerald-600 hover:bg-emerald-50 border-t border-gray-100 bg-white">
              VIEW ALL
            </button>
          </div>
        )}
      </div>

      {/* --- USER PROFILE SECTION --- */}
      <div className="relative">
        <button
          onClick={() => {
            setShowProfile(!showProfile);
            setShowNotifs(false);
          }}
          /* Added border to the avatar to make it pop against the purple navbar */
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition border-2 overflow-hidden ${
            showProfile
              ? "border-emerald-400"
              : "border-white/20 hover:border-white/50"
          }`}>
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {getInitials(user.name)}
            </div>
          )}
        </button>

        {showProfile && (
          <div className="absolute right-0 top-12 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-4 bg-emerald-800 text-white">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-[10px] opacity-70 truncate">{user.email}</p>
            </div>
            <div className="p-2 space-y-0.5">
              <button
                onClick={() => {
                  router.push("#");
                  setShowProfile(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition">
                My Profile
              </button>
              {user.role === "admin" && (
                <button
                  onClick={() => {
                    router.push("/admin");
                    setShowProfile(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition">
                  Admin Dashboard
                </button>
              )}
              <div className="h-px bg-gray-100 my-1 mx-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
