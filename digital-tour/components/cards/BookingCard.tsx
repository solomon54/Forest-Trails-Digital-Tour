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

  const performAction = async (action: ActionType) => {
    setActionLoading(action);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
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

  const handleApprove = () => performAction("confirm");
  const handleRejectConfirm = () => {
    setShowRejectConfirm(false);
    performAction("reject");
  };

  const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-mono uppercase">Booking ID: #{booking.id}</p>
            <h3 className="text-xl font-bold text-gray-900">{booking.listing?.name || "Unknown Tour"}</h3>
            <p className="text-sm text-gray-600">{booking.listing?.location || "Location not specified"}</p>
          </div>

          <span
            className={`px-4 py-2 w-fit rounded-full text-xs font-bold uppercase text-center ${statusStyle.bg} ${statusStyle.text}`}
          >
            {booking.status}
          </span>
        </div>

        {/* Dates & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Travel Dates</p>
            <p className="text-gray-600 text-sm">
              {new Date(booking.start_date).toLocaleDateString()} →{" "}
              {new Date(booking.end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Payment</p>
            <p className="text-gray-600 capitalize">
              {booking.payment_method} • {booking.payment_status}
            </p>
          </div>
        </div>

        {/* Guest Info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="font-semibold text-gray-800">Guest Details</p>
          <p className="text-gray-600">
            {booking.contact?.first_name} {booking.contact?.last_name}
          </p>
          <p className="text-sm text-gray-600">{booking.contact?.email}</p>
          <p className="text-sm text-gray-600">{booking.contact?.phone_number}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 flex items-center gap-2">
            <HiExclamationCircle className="text-lg shrink-0" />
            {error}
          </div>
        )}

        {/* Actions - Only for pending */}
        {booking.status === "pending" && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Approve Button - Emerald stays strong */}
              <button
                onClick={handleApprove}
                disabled={!!actionLoading}
                className="flex-1 px-3 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
              >
                {actionLoading === "confirm" ? "Processing..." : "Approve Booking"}
              </button>

              {/* Reject Button */}
              <button
                onClick={() => setShowRejectConfirm(true)}
                disabled={!!actionLoading}
                className="flex-1 px-3 py-2.5 border bg-red-600/20 border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 disabled:opacity-60 transition"
              >
                Reject Booking
              </button>
            </div>

            {/* Reject Confirmation */}
            {showRejectConfirm && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-1.5 space-y-2 ">
                <div className="flex items-start gap-3 ">
                  <HiExclamationCircle className="text-2xl text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 text-sm">Confirm Rejection</p>
                    <p className="text-xs text-red-800 mt-1">
                      This action cannot be undone. The user will be notified.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-1">
                  <button
                    onClick={handleRejectConfirm}
                    disabled={actionLoading === "reject"}
                    className="px-2 py-1 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-60 transition shadow-sm"
                  >
                    {actionLoading === "reject" ? "Processing..." : "Yes, Reject"}
                  </button>
                  <button
                    onClick={() => setShowRejectConfirm(false)}
                    disabled={!!actionLoading}
                    className="px-2 py-1 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
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