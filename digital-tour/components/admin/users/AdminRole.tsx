// components/admin/users/AdminRole.tsx
import { useState } from "react";
import { AdminUser } from "@/pages/admin/users";
import { HiExclamationCircle, HiCheckCircle } from "react-icons/hi";

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
  const [justSucceeded, setJustSucceeded] = useState(false);

  const showRevoke = activeRevokeUserId === user.id;

  const updateRole = async (newRole: "user" | "admin") => {
    if (newRole === "user" && !reason.trim()) return;

    setLoading(true);
    setJustSucceeded(false);

    const payload: { role: "user" | "admin"; reason?: string } = { role: newRole };
    if (newRole === "user") payload.reason = reason.trim();

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

      onUpdated(data);

      setJustSucceeded(true);
      setTimeout(() => setJustSucceeded(false), 2500);

      setActiveRevokeUserId(null);
      setReason("");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserIsSuperAdmin) return null;

  const isSelf = user.id === currentUserId;
  const isSuperAdmin = user.is_super_admin;

  /* ===== SUCCESS STATE ===== */
  if (justSucceeded) {
    return (
      <div className="flex items-center justify-center gap-2 text-green-600 font-medium text-sm py-2">
        <HiCheckCircle className="text-xl shrink-0" />
        <span className="text-center">
          {user.role === "admin" ? "Admin granted" : "Privileges revoked"}
        </span>
      </div>
    );
  }

  /* ===== GRANT ADMIN ===== */
  if (user.role === "user") {
    return (
      <button
        disabled={loading}
        onClick={() => updateRole("admin")}
        className="
          w-full sm:w-auto
          px-4 py-2.5
          text-sm font-medium
          bg-emerald-600 text-white
          rounded-lg
          hover:bg-emerald-700
          disabled:opacity-60
          shadow-sm transition
        "
      >
        {loading ? "Granting..." : "Grant Admin"}
      </button>
    );
  }

  /* ===== PROTECTED STATES ===== */
  if (isSuperAdmin || isSelf) {
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-full bg-amber-100 text-amber-800 text-center">
          <HiExclamationCircle className="text-base shrink-0" />
          {isSuperAdmin ? "Super Admin (protected)" : "Cannot revoke yourself"}
        </span>
      </div>
    );
  }

  /* ===== REVOKE ADMIN ===== */
  return (
    <div className="w-full">
      {!showRevoke && (
        <button
          onClick={() => setActiveRevokeUserId(user.id)}
          disabled={loading}
          className="
            w-full
            px-4 py-2.5
            text-sm font-medium
            bg-red-100 text-red-700
            rounded-lg
            hover:bg-red-200
            shadow-sm transition
          "
        >
          Revoke Admin
        </button>
      )}

      {showRevoke && (
        <div className="mt-3 p-4 bg-red-50 border border-red-300 rounded-xl shadow space-y-4">
          <div className="flex items-start gap-3">
            <HiExclamationCircle className="text-xl text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm">
                Revoke Admin Privileges
              </p>
              <p className="text-xs text-red-800 mt-1">
                <strong>{user.name || user.email}</strong> will lose access immediately.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Reason <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Inactive, role change, security..."
              className="
                w-full px-3 py-2
                text-sm text-gray-500
                rounded-lg
                border border-gray-300
                focus:border-red-500
                focus:ring-2 focus:ring-red-100
                resize-none
              "
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Logged for audit.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setActiveRevokeUserId(null);
                setReason("");
              }}
              disabled={loading}
              className="
                w-full sm:w-auto
                px-3 py-2.5
                text-sm font-medium
                text-gray-700
                bg-gray-300
                rounded-lg
                hover:bg-gray-400
              "
            >
              Cancel
            </button>

            <button
              disabled={!reason.trim() || loading}
              onClick={() => updateRole("user")}
              className="
                w-full sm:w-auto
                px-3 py-2.5
                text-sm font-medium
                text-white
                bg-red-600
                rounded-lg
                hover:bg-red-700
                disabled:opacity-60
                shadow-sm
              "
            >
              {loading ? "Revoking..." : "Confirm Revoke"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
