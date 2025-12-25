// pages/admin/bookings/index.tsx
import { useEffect, useState } from "react";
import BookingsTabHeader, { BookingTab } from "@/components/admin/bookings/BookingsTabHeader";
import { Booking } from "@/types/booking";
import BookingCard from "@/components/cards/BookingCard";
import AdminLayout from "@/components/layout/AdminLayout";

const PAGE_LIMIT = 12; // Slightly more for better mobile grid

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
      <div className="space-y-8">
        {/* Page Header - Consistent with other admin pages */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all tour bookings across statuses: Pending, Confirmed, Completed, and Cancelled.
          </p>
        </div>

        {/* Tabs */}
        <BookingsTabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Bookings Grid */}
        {bookings.length === 0 && loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No {activeTab.toLowerCase()} bookings</p>
            <p className="text-sm text-gray-500 mt-1">
              Bookings will appear here when users make reservations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
            >
              {loading ? "Loading more..." : "Load More Bookings"}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}