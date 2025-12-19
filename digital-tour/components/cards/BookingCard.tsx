// components/cards/BookingCard.tsx
import { useState } from "react";
import { Booking } from "@/types/booking";

interface Props {
  booking: Booking;
  onUpdate?: (updatedBooking: Booking) => void; // callback to refresh parent state
}

export default function BookingCard({ booking, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!booking) return null;

  const handleAction = async (action: "confirm" | "reject" | "cancel") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update booking");
      }

      // Update parent state
      if (onUpdate) onUpdate(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">Booking #{booking.id}</p>
          <p className="text-lg">
            <span className="font-semibold">Site Name: </span>
            {booking.listing.name}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Location: </span>
            {booking.listing.location}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
            ${booking.status === "pending" && "bg-yellow-100 text-yellow-800"}
            ${booking.status === "confirmed" && "bg-green-100 text-green-800"}
            ${booking.status === "rejected" && "bg-red-100 text-red-800"}
            ${booking.status === "cancelled" && "bg-gray-100 text-gray-800"}
          `}
        >
          {booking.status}
        </span>
      </div>

      {/* Guest info */}
      <div className="text-sm py-1">
        <p className="text-gray-500 text-lg font-extrabold">Guest</p>
        <p className="font-medium">
          <span className="font-semibold pr-2">Name: </span>
          {booking?.contact?.first_name} {booking?.contact?.last_name}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold pr-2">Email:</span>
          {booking?.contact?.email}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold pr-2">Phone:</span>
          {booking?.contact?.phone_number}
        </p>
      </div>

      {/* Dates + payment */}
      <div className="text-sm">
        <p>
          <span className="font-semibold p-2">Date:</span> {booking.start_date} → {booking.end_date}
        </p>
        <p className="capitalize">
          <span className="font-semibold p-2">Payment Method:</span> {booking.payment_method}
        </p>
      </div>

      {/* Actions */}
      {booking.status === "pending" && (
        <div className="flex gap-2 md:gap-4 lg:gap-6 pt-2 justify-center">
          <button
            className="bg-green-600 text-white rounded-lg px-6 py-2 disabled:opacity-50"
            disabled={loading}
            onClick={() => handleAction("confirm")}
          >
            {loading ? "Processing..." : "Approve"}
          </button>
          <button
            className="bg-red-600 text-white rounded-lg px-6 py-2 disabled:opacity-50"
            disabled={loading}
            onClick={() => handleAction("reject")}
          >
            {loading ? "Processing..." : "Reject"}
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
