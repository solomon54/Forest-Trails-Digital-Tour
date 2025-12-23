// components/admin/users/AdminRole.tsx
import { useState } from "react";
import { AdminUser } from "@/pages/admin/users";

interface Props {
  user: AdminUser;
  currentUserId: number;
  currentUserIsSuperAdmin: boolean;
  activeRevokeUserId: number | null;
  setActiveRevokeUserId: (id: number | null) => void;
  onUpdated: (user: AdminUser) => void;
}

export default function AdminRole({
  user,
  currentUserId,
  currentUserIsSuperAdmin,
  activeRevokeUserId,
  setActiveRevokeUserId,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showRevoke = activeRevokeUserId === user.id;

  const updateRole = async (payload: { role: "user" | "admin"; reason?: string }) => {
    setLoading(true);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Action failed");
        return;
      }

      // Update parent immediately
      onUpdated(data);

      // Show subtle success message
      setSuccessMessage(
        payload.role === "admin"
          ? "Admin privileges granted ✅"
          : "Admin privileges revoked ✅"
      );

      // Reset revoke state
      setActiveRevokeUserId(null);
      setReason("");

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserIsSuperAdmin) return null;

  const isSelf = user.id === currentUserId;
  const isSuperAdmin = user.is_super_admin;

  /* ===== GRANT ADMIN ===== */
  if (user.role === "user") {
    return (
      <div className="flex flex-col items-start sm:items-end gap-1 relative">
        <button
          disabled={loading}
          onClick={() => updateRole({ role: "admin" })}
          className="rounded px-3 py-1 text-sm font-medium bg-blue-600/90 text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Granting..." : "Grant admin"}
        </button>

        {successMessage && (
          <span className="absolute top-full mt-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded animate-fade-in">
            {successMessage}
          </span>
        )}
      </div>
    );
  }

  /* ===== PROTECTED STATES ===== */
  if (isSuperAdmin || isSelf) {
    return (
      <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
        {isSuperAdmin ? "Super admin (protected)" : "Cannot revoke yourself"}
      </span>
    );
  }

  /* ===== REVOKE ADMIN ===== */
  return (
    <div className="flex flex-col items-start sm:items-end gap-1 relative w-full sm:w-auto">
      {!showRevoke && (
        <button
          onClick={() => setActiveRevokeUserId(user.id)}
          className="rounded px-3 py-1 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-60"
          disabled={loading}
        >
          Revoke admin
        </button>
      )}

      {showRevoke && (
        <div className="mt-2 sm:mt-0 w-full sm:w-80 rounded-lg border border-red-200 bg-red-50 p-3 space-y-3 shadow-sm">
          <p className="text-sm font-semibold text-red-800">
            Confirm admin revocation
          </p>

          <textarea
            rows={3}
            disabled={loading}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (required)"
            className="w-full resize-none rounded border border-red-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-gray-100"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setActiveRevokeUserId(null);
                setReason("");
              }}
              disabled={loading}
              className="rounded bg-gray-500 text-gray-50 px-3 py-1 text-sm hover:bg-gray-400 disabled:opacity-60 transition"
            >
              Cancel
            </button>

            <button
              disabled={!reason.trim() || loading}
              onClick={() =>
                updateRole({ role: "user", reason: reason.trim() })
              }
              className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition"
            >
              {loading ? "Revoking..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <span className="absolute top-full mt-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded animate-fade-in">
          {successMessage}
        </span>
      )}
    </div>
  );
}
