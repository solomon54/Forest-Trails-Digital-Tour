// pages/tours/index.tsx
import { useEffect, useState } from "react";
import { getAllListings } from "@/services/listingService";
import { Listing } from "@/types/admin";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import { MdLocationOn } from "react-icons/md";

const TourMedia = ({
  url,
  name,
  location,
}: {
  url: string | null;
  name: string;
  location?: string | null;
}) => {
  const placeholder = "/images/placeholder.jpg";

  if (!url) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-t-2xl flex items-center justify-center">
        <span className="text-gray-400 text-lg">No image</span>
      </div>
    );
  }

  const isVideo = url.toLowerCase().match(/\.(mp4|webm)$/);

  return isVideo ? (
    <video
      src={url}
      muted
      loop
      playsInline
      className="w-full h-64 object-cover rounded-t-2xl"
      poster={placeholder}
    >
      <track kind="captions" />
    </video>
  ) : (
    <img
      src={url}
      alt={`${name} in ${location || "destination"}`}
      className="w-full h-64 object-cover rounded-t-2xl transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = placeholder;
      }}
    />
  );
};

export default function ToursListingPage() {
  const [tours, setTours] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getAllListings({ status: "active" });
        setTours(data);
      } catch (err) {
        console.error("Failed to load tours:", err);
        setError("Unable to load tours at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Header */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Discover Your Next Adventure
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0">
            Hand-curated tours and unique experiences waiting just for you.
          </p>
          <hr />
        </section>

        {/* Tours Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-32 h-32 mx-auto mb-6" />
              <p className="text-2xl font-medium text-gray-800">No tours available yet</p>
              <p className="text-gray-600 mt-2">Check back soon — new adventures are coming!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {tours.map((tour) => {
                const price = tour.price > 0 ? `$${tour.price}` : "Inquire";

                return (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.id}`}
                    className="group block transform hover:-translate-y-2 transition-all duration-300"
                  >
                    <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden flex flex-col h-full border border-gray-100">
                      <TourMedia url={tour.url} name={tour.name} location={tour.location} />

                      <div className="p-6 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition">
                          {tour.name}
                        </h2>

                        <div className="flex items-center gap-1.5 text-gray-600 mt-3">
                          <MdLocationOn className="text-emerald-600 text-lg" />
                          <span className="text-sm">
                            {tour.location || "Location coming soon"}
                          </span>
                        </div>

                        <p className="text-gray-600 mt-4 line-clamp-3 grow">
                          {tour.description || "Explore this incredible journey..."}
                        </p>

                        <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-2xl font-bold text-emerald-600">{price}</p>
                            <p className="text-xs text-gray-500">per person</p>
                          </div>

                          <span className="text-emerald-700 font-medium group-hover:underline">
                            View details →
                          </span>
                        </div>

                        {tour.creator && (
                          <p className="text-xs text-gray-500 mt-4 text-right">
                            Hosted by {tour.creator.name}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}