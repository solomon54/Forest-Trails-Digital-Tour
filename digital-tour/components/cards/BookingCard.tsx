// components/cards/BookingCard.tsx
import { useState } from "react";
import { Booking } from "@/types/booking";

interface Props {
  booking: Booking;
  onUpdate?: (updatedBooking: Booking) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

type ActionType = "confirm" | "reject" | "cancel";

export default function BookingCard({ booking, onUpdate }: Props) {
  const [actionLoading, setActionLoading] = useState<ActionType | null>(null);
  const [error, setError] = useState("");
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  if (!booking) return null;

  /* ===================== API ACTION ===================== */
  const performAction = async (action: ActionType) => {
    setActionLoading(action);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update booking");

      onUpdate?.(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  /* ===================== HANDLERS ===================== */
  const handleApprove = () => performAction("confirm");

  const handleRejectRequest = () => setShowRejectConfirm(true);

  const handleRejectConfirm = () => {
    setShowRejectConfirm(false);
    performAction("reject");
  };

  const handleRejectCancel = () => setShowRejectConfirm(false);

  /* ===================== UI ===================== */
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 space-y-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
        <div>
          <p className="text-xs text-gray-400 font-mono">ID: #{booking.id}</p>
          <h3 className="text-lg font-bold">{booking.listing?.name}</h3>
          <p className="text-sm text-gray-500">{booking.listing?.location}</p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Dates:</span>{" "}
            {booking.start_date} → {booking.end_date}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Payment:</span>{" "}
            {booking.payment_method} ({booking.payment_status})
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      {/* Guest Info */}
      <div className="text-sm bg-gray-50 p-3 rounded-md">
        <p className="font-bold text-gray-700 mb-1">Guest Details</p>
        <p>
          {booking.contact?.first_name} {booking.contact?.last_name}
        </p>
        <p className="text-gray-500">{booking.contact?.email}</p>
        <p className="text-gray-500">{booking.contact?.phone_number}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-2 rounded font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Actions */}
      {booking.status === "pending" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 md:w-1/2">
            <button
              disabled={!!actionLoading}
              onClick={handleApprove}
              className="flex-1 bg-green-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-emerald-600 transition"
            >
              {actionLoading === "confirm" ? "Processing..." : "Approve"}
            </button>

            <button
              disabled={!!actionLoading}
              onClick={handleRejectRequest}
              className="flex-1 border bg-red-700/20 border-red-600 text-red-600 py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-red-500/20 transition"
            >
              Reject
            </button>
          </div>

          {/* Reject Confirmation */}
          {showRejectConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm space-y-2">
              <p className="text-red-700 text-base font-medium">
                ⚠️ Confirm rejection
              </p>
              <p className="text-red-500 text-sm sm:text-xs">
                Pleas, This action cannot be undone.
              </p>

              <div className="flex gap-2 w-2/3">
                <button
                  onClick={handleRejectConfirm}
                  disabled={actionLoading === "reject"}
                  className="flex-1 bg-red-600/90 text-white py-1.5 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === "reject" ? "Processing..." : "Yes, Reject"}
                </button>

                <button
                  onClick={handleRejectCancel}
                  disabled={!!actionLoading}
                  className="flex-1 bg-gray-300 text-gray-700 py-1.5 rounded-md text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
