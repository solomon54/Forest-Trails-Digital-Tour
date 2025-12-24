// pages/tours/index.tsx

import { useEffect, useState } from "react";
import { getAllListings } from "@/services/listingService";
import { Listing } from "@/types/admin";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { MdLocationOn } from "react-icons/md";
import Navbar from "@/components/navbar/Navbar";

const getMediaType = (
  url: string | null | undefined
): "image" | "video" | "placeholder" => {
  if (!url) return "placeholder";
  const lower = url.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm")) return "video";
  if (lower.match(/\.(jpg|jpeg|png|avif)$/)) return "image";
  return "placeholder";
};

const TourMedia = ({
  url,
  name,
  location,
}: {
  url: string;
  name: string;
  location?: string | null;
}) => {
  const placeholder = "/images/placeholder.jpg";
  const mediaType = getMediaType(url);

  if (mediaType === "video") {
    return (
      <video
        src={url}
        muted
        playsInline
        poster={placeholder}
        className="w-full h-60 object-cover rounded-t-2xl"
      />
    );
  }

  return (
    <img
      src={url || placeholder}
      alt={`${name} - ${location ?? "Tour"}`}
      className="w-full h-60 object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-105"
      onError={(e) =>
        ((e.target as HTMLImageElement).src = placeholder)
      }
    />
  );
};

export default function ToursListingPage() {
  const [tours, setTours] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTours() {
      try {
        setTours(await getAllListings({ status: "active" }));
      } catch {
        setError("Failed to load tours. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  if (loading) return <CardSkeleton />;
  if (error)
    return <div className="py-20 text-center text-red-600">{error}</div>;

  return (
    <main className="bg-gray-100 p-4 sm:p-0">
      <Navbar />

      {/* Page Header – CLEAN & CALM */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Explore Tours
        </h1>
        <p className="text-lg text-gray-600 mt-3 max-w-3xl">
          Discover hand-picked experiences, unique stays, and unforgettable journeys.
        </p>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {tours.map((tour) => {
            const price =
              Number(tour.price) > 0
                ? `$${Number(tour.price).toFixed(2)}`
                : "Price TBD";

            return (
              <Link
                key={tour.id}
                href={`/tours/${tour.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col h-full">
                  <TourMedia
                    url={tour.url}
                    name={tour.name}
                    location={tour.location}
                  />

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {tour.name}
                    </h2>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                      <MdLocationOn className="text-emerald-600" />
                      <span>{tour.location || "Location TBD"}</span>
                    </div>

                    <p className="text-base text-gray-600 mt-3 line-clamp-3 flex-grow">
                      {tour.description}
                    </p>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-xl font-bold text-emerald-600">
                        {price}
                      </span>

                      <span className="text-sm font-semibold text-emerald-700 group-hover:underline">
                        View details →
                      </span>
                    </div>

                    {tour.creator && (
                      <p className="text-xs text-gray-400 mt-4">
                        Hosted by {tour.creator.name}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
