import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export default function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  // Generate initials if no photo
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase() ?? "";
    const second = parts[1]?.charAt(0).toUpperCase() ?? "";
    return first + second;
  };

  const initials = getInitials(user.name);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/Login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-200 w-9 h-9 rounded-full rounded-xl shadow hover:bg-gray-100"
      >

        {/* Avatar or initials */}
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
            {initials}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md z-50">

        {/* Username */}
        <span className="font-medium">{user.name}</span>
          <p></p>
          <button
            onClick={() => router.push("/profile")}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
