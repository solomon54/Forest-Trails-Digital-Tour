// components/admin/users/AdminRole.tsx
import { useState } from "react";
import { AdminUser } from "@/pages/admin/users";
import { HiExclamationCircle } from "react-icons/hi";

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

  const updateRole = async (newRole: "user" | "admin") => {
    setLoading(true);
    setSuccessMessage(null);

    const payload: { role: "user" | "admin"; reason?: string } = { role: newRole };
    if (newRole === "user") {
      payload.reason = reason.trim();
    }

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

      setSuccessMessage(
        newRole === "admin"
          ? "Admin privileges granted ✅"
          : "Admin privileges revoked ✅"
      );

      // Reset form
      setActiveRevokeUserId(null);
      setReason("");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
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
      <div className="relative">
        <button
          disabled={loading}
          onClick={() => updateRole("admin")}
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 shadow-sm"
        >
          {loading ? "Granting..." : "Grant Admin"}
        </button>

        {successMessage && (
          <div className="absolute -top-12 left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-auto">
            <span className="inline-block text-sm font-medium text-green-700 bg-green-100 px-4 py-2 rounded-lg shadow-lg">
              {successMessage}
            </span>
          </div>
        )}
      </div>
    );
  }

  /* ===== PROTECTED STATES ===== */
  if (isSuperAdmin || isSelf) {
    return (
      <div className="w-full sm:w-auto">
        <span className="inline-flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-3 py-2 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          <HiExclamationCircle className="text-lg shrink-0" />
          <span className="text-center sm:text-left">
            {isSuperAdmin ? "Super Admin (protected)" : "Cannot revoke yourself"}
          </span>
        </span>
      </div>
    );
  }

  /* ===== REVOKE ADMIN (with required reason) ===== */
  return (
    <div className="relative w-full">
      {!showRevoke && (
        <button
          onClick={() => setActiveRevokeUserId(user.id)}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition shadow-sm"
        >
          Revoke Admin
        </button>
      )}

      {showRevoke && (
        <div className="w-full p-4 sm:p-6 bg-red-50 border border-red-300 rounded-xl shadow-lg space-y-4 sm:space-y-5">
          {/* Warning Header */}
          <div className="flex items-start gap-3">
            <HiExclamationCircle className="text-2xl sm:text-3xl text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900 text-base md:text-xs">
                Revoke Admin Privileges
              </p>
              <p className="text-sm text-red-800 mt-1">
                <strong>{user.name || user.email}</strong> will immediately lose all admin access.
              </p>
            </div>
          </div>

          {/* Reason Field - Required */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Reason for revocation <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Inactive for 6+ months, role no longer needed, security concern..."
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 resize-none transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be logged for audit purposes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              onClick={() => {
                setActiveRevokeUserId(null);
                setReason("");
              }}
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition order-2 sm:order-1"
            >
              Cancel
            </button>

            <button
              disabled={!reason.trim() || loading}
              onClick={() => updateRole("user")}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm order-1 sm:order-2"
            >
              {loading ? "Revoking..." : "Confirm & Revoke"}
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="absolute -top-12 left-0 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-auto">
          <span className="inline-block text-sm font-medium text-green-700 bg-green-100 px-4 py-2 rounded-lg shadow-lg">
            {successMessage}
          </span>
        </div>
      )}
    </div>
  );
}