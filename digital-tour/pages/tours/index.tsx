import { useEffect, useState } from "react";
import { getAllListings } from "@/services/listingService";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import Link from "next/link";

export default function ToursListingPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await getAllListings();
        setTours(data);
      } catch (err) {
        console.error("Error loading tours:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, []);

  if (loading) return <CardSkeleton />;

  if (tours.length === 0) {
    return <div className="p-8 text-center text-slate-600">No tours yet.</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <Link href={`/tours/${tour.id}`} key={tour.id}>
          <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition cursor-pointer">
            <img
              src={tour.cover_image || "/images/placeholder.jpg"}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl mt-4 font-semibold">{tour.name}</h2>
            <p className="text-slate-600">{tour.location}</p>
            <p className="text-amber-600 font-semibold mt-2">${tour.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
