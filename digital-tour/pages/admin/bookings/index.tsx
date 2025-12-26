// pages/admin/bookings/index.tsx
import { useEffect, useState } from "react";
import BookingsTabHeader, { BookingTab } from "@/components/admin/bookings/BookingsTabHeader";
import { Booking } from "@/types/booking";
import BookingCard from "@/components/cards/BookingCard";
import AdminLayout from "@/components/layout/AdminLayout";

const PAGE_LIMIT = 12; 

export default function AdminBookings() {
  const [activeTab, setActiveTab] = useState<BookingTab>("Pending");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (tab: BookingTab, pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/bookings?tab=${tab.toLowerCase()}&page=${pageNumber}&limit=${PAGE_LIMIT}`
      );

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();

      if (pageNumber === 1) {
        setBookings(data.bookings);
      } else {
        setBookings((prev) => [...prev, ...data.bookings]);
      }

      setHasMore(data.bookings.length === PAGE_LIMIT);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch on tab change
  useEffect(() => {
    setPage(1);
    setBookings([]);
    setHasMore(true);
    fetchBookings(activeTab, 1);
  }, [activeTab]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBookings(activeTab, nextPage);
  };

  const handleUpdateBooking = (updated: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === updated.id ? updated : b))
    );
  };

  return (
    <AdminLayout>
  <div className="space-y-6 sm:space-y-8">

    {/* Header */}
    <div className="border-b border-gray-200 pb-4 sm:pb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Bookings Management
      </h1>
      <p className="mt-1 sm:mt-2 text-sm text-gray-600">
        View and manage all tour bookings across statuses.
      </p>
    </div>

    {/* Tabs */}
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <BookingsTabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>

    {/* Error */}
    {error && (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
        {error}
      </div>
    )}

    {/* Content */}
    {bookings.length === 0 && loading ? (
      <div className="text-center py-8 sm:py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-3 text-gray-600 text-sm">Loading bookings...</p>
      </div>
    ) : bookings.length === 0 ? (
      <div className="text-center py-8 sm:py-12 bg-white rounded-xl sm:rounded-2xl shadow-sm">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4" />
        <p className="text-base sm:text-lg font-medium text-gray-900">
          No {activeTab.toLowerCase()} bookings
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Bookings will appear here when users make reservations.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onUpdate={handleUpdateBooking}
          />
        ))}
      </div>
    )}

    {/* Load More */}
    {hasMore && (
      <div className="flex justify-center mt-6 sm:mt-8">
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="
            px-4 py-2.5 sm:px-5
            text-sm sm:text-base
            bg-emerald-600 text-white
            font-medium rounded-lg
            hover:bg-emerald-700
            disabled:opacity-60
            transition shadow-sm
          "
        >
          {loading ? "Loading more..." : "Load More Bookings"}
        </button>
      </div>
    )}
  </div>
</AdminLayout>

  );
}