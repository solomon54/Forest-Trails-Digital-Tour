//pages/admin/bookings/index.tsx
import { useEffect, useState } from "react";
import BookingsTabHeader from "@/components/admin/bookings/BookingsTabHeader";
import { Booking } from "@/types/booking";
import BookingCard from "@/components/cards/BookingCard";

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "Pending") return b.status === "pending";
    if (activeTab === "Rejected") return b.status === "rejected";
    if (activeTab === "Approved") return b.status === "confirmed";
    return false;
  });

  return (
    <div className="bg-gray-200 text-gray-700 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <BookingsTabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading ? (
        <p>Loading...</p>
      ) : filteredBookings.length === 0 ? (
        <p>No bookings in this section.</p>
      ) : (
        <div className="space-y-4">
  {filteredBookings.map((b) => (
    <BookingCard key={b.id} booking={b} />
  ))}
</div>

      )}
    </div>
  );
}
