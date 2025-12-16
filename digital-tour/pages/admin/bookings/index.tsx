import { useEffect, useState } from "react";
import BookingsTabHeader from "@/components/admin/bookings/BookingsTabHeader";
import { Booking } from "@/types/booking";

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
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Listing</th>
              <th className="p-2 border">Dates</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id} className="text-center border-b">
                <td className="p-2 border">{b.id}</td>
                <td className="p-2 border">{b.user.name}</td>
                <td className="p-2 border">{b.listing.name}</td>
                <td className="p-2 border">
                  {b.start_date} → {b.end_date}
                </td>
                <td className="p-2 border">{b.payment_method}</td>
                <td className="p-2 border">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
