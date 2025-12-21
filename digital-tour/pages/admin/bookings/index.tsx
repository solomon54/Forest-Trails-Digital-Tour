// pages/admin/bookings/index.tsx
import { useEffect, useState } from "react";
import BookingsTabHeader, { BookingTab } from "@/components/admin/bookings/BookingsTabHeader";
import { Booking } from "@/types/booking";
import BookingCard from "@/components/cards/BookingCard";

const PAGE_LIMIT = 10;

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<BookingTab>("Pending");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async (tab: BookingTab, pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?tab=${tab.toLowerCase()}&page=${pageNumber}&limit=${PAGE_LIMIT}`);
      const data = await res.json();
      if (pageNumber === 1) setBookings(data.bookings);
      else setBookings((prev) => [...prev, ...data.bookings]);

      setHasMore(data.bookings.length === PAGE_LIMIT); // if less than limit → no more
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load first page on tab change
  useEffect(() => {
    setPage(1);
    fetchBookings(activeTab, 1);
  }, [activeTab]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBookings(activeTab, nextPage);
  };

  const handleUpdateBooking = (updated: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  return (
    <div className="bg-gray-100 text-gray-700 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <BookingsTabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {bookings.length === 0 && loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings in this section.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} onUpdate={handleUpdateBooking} />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}

      {loading && bookings.length > 0 && (
        <p className="text-center mt-2 text-gray-500">Loading more...</p>
      )}
    </div>
  );
}
