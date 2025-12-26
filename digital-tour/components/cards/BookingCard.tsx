// components/cards/BookingCard.tsx
import { useState } from "react";
import { Booking } from "@/types/booking";
import { HiExclamationCircle } from "react-icons/hi";

interface Props {
  booking: Booking;
  onUpdate?: (updatedBooking: Booking) => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  confirmed: { bg: "bg-emerald-100", text: "text-emerald-800" },
  completed: { bg: "bg-blue-100", text: "text-blue-800" },
  cancelled: { bg: "bg-gray-100", text: "text-gray-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
};

type ActionType = "confirm" | "reject";

export default function BookingCard({ booking, onUpdate }: Props) {
  const [actionLoading, setActionLoading] = useState<ActionType | null>(null);
  const [error, setError] = useState("");
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  if (!booking) return null;

  const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

  const performAction = async (action: ActionType) => {
    setActionLoading(action);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update booking");

      onUpdate?.(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* ================= Header ================= */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
          <div className="space-y-0.5">
            <p className="text-[10px] sm:text-xs text-gray-400 font-mono uppercase">
              Booking #{booking.id}
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              {booking.listing?.name || "Unknown Tour"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {booking.listing?.location || "Location not specified"}
            </p>
          </div>

          <span
            className={`self-start px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase ${statusStyle.bg} ${statusStyle.text}`}
          >
            {booking.status}
          </span>
        </div>

        {/* ================= Dates & Payment ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <p className="font-medium text-gray-700">Travel Dates</p>
            <p className="text-gray-600">
              {new Date(booking.start_date).toLocaleDateString()} →{" "}
              {new Date(booking.end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Payment</p>
            <p className="text-gray-600 capitalize">
              {booking.payment_method} • {booking.payment_status}
            </p>
          </div>
        </div>

        {/* ================= Guest ================= */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1.5 text-xs sm:text-sm">
          <p className="font-semibold text-gray-800">Guest</p>
          <p className="text-gray-700">
            {booking.contact?.first_name} {booking.contact?.last_name}
          </p>
          <p className="text-gray-600 break-all">{booking.contact?.email}</p>
          <p className="text-gray-600">{booking.contact?.phone_number}</p>
        </div>

        {/* ================= Error ================= */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
            <HiExclamationCircle className="text-base shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= Actions ================= */}
        {booking.status === "pending" && (
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => performAction("confirm")}
                disabled={!!actionLoading}
                className="w-full sm:flex-1 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition"
              >
                {actionLoading === "confirm" ? "Processing…" : "Approve"}
              </button>

              <button
                onClick={() => setShowRejectConfirm(true)}
                disabled={!!actionLoading}
                className="w-full sm:flex-1 py-2 text-sm font-medium border border-red-500/40 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Reject
              </button>
            </div>

            {showRejectConfirm && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <HiExclamationCircle className="text-lg text-red-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 text-xs">
                      Confirm rejection
                    </p>
                    <p className="text-[11px] text-red-800">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => performAction("reject")}
                    disabled={actionLoading === "reject"}
                    className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    {actionLoading === "reject" ? "…" : "Yes"}
                  </button>
                  <button
                    onClick={() => setShowRejectConfirm(false)}
                    className="px-3 py-1.5 text-xs bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
