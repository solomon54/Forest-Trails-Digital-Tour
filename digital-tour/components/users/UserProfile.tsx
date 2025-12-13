import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export default function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();

  // ✅ Hooks ALWAYS at top
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return (
      (parts[0]?.[0] ?? "").toUpperCase() +
      (parts[1]?.[0] ?? "").toUpperCase()
    );
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/Login");
  };

  // ✅ Outside click handler — ALWAYS called
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Safe early return AFTER hooks
  if (!user) return null;

  return (
    <div ref={menuRef} className="fixed top-4 right-4 z-50">
      {/* Avatar */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm flex items-center justify-center transition"
      >
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
            {getInitials(user.name)}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          {/* User Info */}
          <div className="px-4 py-3">
            <button
              onClick={() => {}}
              className="block w-full text-left font-semibold text-gray-900 hover:underline"
            >
              {user.name}
            </button>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Profile (inactive but clickable) */}
          <button
            onClick={() => {}}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Profile
          </button>

          <div className="border-t border-gray-100" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
