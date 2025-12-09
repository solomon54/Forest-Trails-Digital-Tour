//tours/index.tsx
import { useEffect, useState } from "react";
import { getAllListings } from "@/services/listingService";
import { Listing } from "@/types/admin";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import Link from "next/link";

export default function ToursListingPage() {
  const [tours, setTours] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTours() {
      try {
        setError(null);
        const data = await getAllListings();
        console.log("Fetched tours:", data);  // DEBUG: Check console for full data
        setTours(data);
      } catch (err) {
        console.error("Error loading tours:", err);
        setError("Failed to load tours. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  if (loading) return <CardSkeleton />;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  if (tours.length === 0) {
    return <div className="p-8 text-center text-slate-600">No tours yet.</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => {
        // FIXED: Safe price parsing (string -> number -> format)
              const priceNum = Number(tour.price) || 0;
      const formattedPrice = priceNum > 0 ? `$${priceNum.toFixed(2)}` : "Price TBD";

      const coverImage =
        tour.resources?.find((r) => r.type === "image" && r.status === "approved")?.url ||
        tour.resources?.[0]?.url ||
        "/images/placeholder.jpg";


       

        return (
          <Link href={`/tours/${tour.id}`} key={tour.id}>
            <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition cursor-pointer">
              <img
                src={coverImage}
                alt={`${tour.name} - ${tour.location || 'Cover Image'}`}  // Better alt
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {  // DEBUG: Log image fails
                  console.warn(`Image failed for ${tour.name}:`, e);
                  (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                }}
              />
              <h2 className="text-xl mt-4 font-semibold">{tour.name}</h2>  {/* Only once */}
              <p className="text-slate-600">{tour.location || 'Location TBD'}</p>
              <p className="text-amber-600 font-semibold mt-2">{formattedPrice}</p>  {/* FIXED: Now shows $50.00 */}
              {tour.creator && (
                <p className="text-sm text-slate-500 mt-1">By {tour.creator.name}</p> 
              )}
              {/* DEBUG: Optional badge for resources count */}
              {tour.resources && tour.resources.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">{tour.resources.length} media items</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}