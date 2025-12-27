// pages/tours/index.tsx
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MdLocationOn } from "react-icons/md";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import CardSkeleton from "@/components/skelotons/CardSkeleton";

import { getAllListings } from "@/services/listingService";
import { Listing } from "@/types/admin";

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

interface TourMediaProps {
  url: string | null;
  name: string;
  location?: string | null;
}

function TourMedia({ url, name, location }: TourMediaProps) {
  if (!url) {
    return (
      <div
        className="w-full h-48 sm:h-56 lg:h-64 bg-gray-200 rounded-t-2xl flex items-center justify-center"
        aria-label="No media available"
      >
        <span className="text-gray-400 text-sm">No image available</span>
      </div>
    );
  }

  const isVideo = /\.(mp4|webm)$/i.test(url);

  if (isVideo) {
    return (
      <video
        src={url}
        muted
        loop
        playsInline
        poster={PLACEHOLDER_IMAGE}
        className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-t-2xl"
        aria-label={`${name} preview video`}
      >
        <track kind="captions" srcLang="en" />
      </video>
    );
  }

  return (
    <img
      src={url}
      alt={`${name} in ${location || "destination"}`}
      className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-t-2xl transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE;
      }}
    />
  );
}

export default function ToursListingPage() {
  const [tours, setTours] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllListings({ status: "active" });
      setTours(data);
    } catch (err) {
      console.error("Failed to load tours:", err);
      setError("Unable to load tours at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return (
    <>
      <Navbar />

      <main
        role="main"
        className="min-h-screen bg-linear-to-b from-gray-50 to-white"
      >
        {/* Hero Header */}
  <section
  aria-labelledby="tours-page-heading"
  className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-10 lg:pb-12 text-center lg:text-left shadow lg:shadow lg:shadow-gray-300  mb-2">
  <h1  id="tours-page-heading"
    className="
      text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-snug sm:leading-tight">
    Discover Your Next Adventure
  </h1>

  <p
    className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
    Hand-curated tours and unique experiences waiting just for you.
  </p>
</section>


        {/* Tours Grid */}
        <section
          aria-label="Available tours"
          className="max-w-7xl mx-auto px-4 sm:px-6 pb-24"
        >
          {loading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              aria-busy="true"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20" role="alert">
              <p className="text-lg text-gray-700 mb-6">{error}</p>
              <button
                type="button"
                onClick={fetchTours}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && tours.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-32 h-32 mx-auto mb-6" />
              <p className="text-xl font-medium text-gray-800">
                No tours available yet
              </p>
              <p className="text-gray-600 mt-2">
                Check back soon — new adventures are coming!
              </p>
            </div>
          )}

          {!loading && !error && tours.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {tours.map((tour) => {
                const price =
                  tour.price && tour.price > 0
                    ? `$${tour.price}`
                    : "Inquire";

                return (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.id}`}
                    aria-label={`View details for ${tour.name}`}
                    className="group block transition-transform hover:-translate-y-2"
                  >
                    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden flex flex-col h-full border border-gray-100">
                      <TourMedia
                        url={tour.url}
                        name={tour.name}
                        location={tour.location}
                      />

                      <div className="p-6 flex flex-col grow">
                        <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-700 transition">
                          {tour.name}
                        </h2>

                        <div className="flex items-center gap-1.5 text-gray-600 mt-3">
                          <MdLocationOn
                            className="text-emerald-600 text-lg"
                            aria-hidden="true"
                          />
                          <span className="text-sm">
                            {tour.location || "Location coming soon"}
                          </span>
                        </div>

                        <p className="text-gray-600 mt-4 line-clamp-3 grow">
                          {tour.description ||
                            "Explore this incredible journey..."}
                        </p>

                        <div className="flex items-end justify-between mt-6 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xl font-bold text-emerald-600">
                              {price}
                            </p>
                            <p className="text-xs text-gray-500">
                              per person
                            </p>
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
