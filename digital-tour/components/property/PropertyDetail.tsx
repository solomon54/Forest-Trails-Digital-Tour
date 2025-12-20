// components/property/PropertyDetail.tsx
import { useMemo } from "react";
import { MdLocationOn } from "react-icons/md";
import { FaDollarSign, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import ReviewSection from "./review/ReviewSection";

interface PropertyDetailProps {
  property: ListingDetail;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const reviewCount = property.reviews?.length ?? 0;

  const averageRating = useMemo(() => {
    if (!reviewCount) return 0;
    return (
      property.reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    );
  }, [property.reviews, reviewCount]);

  const descriptionParagraphs = useMemo(() => {
    return property.description
      ?.split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
  }, [property.description]);

  const scrollToBooking = () => {
    const el = document.getElementById("bookingForm");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <main className="sm:p-0 md:p-2 pb-24">
      <div className="max-w-6xl mx-auto py-10 px-4 lg:px-0">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {property.name}
        </h1>

        {/* Location / Price / Rating / CTA */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 mb-8">
          <div className="flex items-center gap-3 text-gray-700">
            <MdLocationOn className="w-7 h-7 text-emerald-600" />
            <span className="text-lg font-medium">
              {property.location || "Location TBD"}
            </span>
          </div>

          <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <FaDollarSign className="w-8 h-8 text-emerald-600" />
              <span className="text-3xl font-bold text-emerald-600">
                {property.price ?? "Price TBD"}
              </span>
            </div>

            {reviewCount > 0 && (
              <div className="flex items-center gap-3">
                {renderStars(averageRating)}
                <span className="text-sm  text-gray-600 font-medium">
                  {averageRating.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>
            )}

            <button
              onClick={scrollToBooking}
              aria-label="Check availability"
              className="mt-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-8 py-3 rounded-xl shadow-md transition"
            >
              Check Availability
            </button>
          </div>
        </div>

        {/* Media Gallery */}
        {property.media?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {property.media.map((m, idx) => (
              <div
                key={m.id}
                className={`overflow-hidden rounded-xl shadow-lg ${
                  idx === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                {m.type === "image" ? (
                  <img
                    src={m.url}
                    alt={`${property.name} media ${idx + 1}`}
                    className="w-full h-96 object-cover hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={m.url}
                    controls
                    aria-label="Property video"
                    className="w-full h-96 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="mb-12 md:p-3">
          <h2 className="text-2xl font-semibold mb-5">Description</h2>
          <div className="text-gray-600 sm:text-base space-y-4">
            {descriptionParagraphs?.length ? (
              descriptionParagraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="italic">No description available.</p>
            )}
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection listingId={property.id} />
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg sm:hidden">
        <button
          onClick={scrollToBooking}
          aria-label="Check availability"
          className="w-full bg-emerald-600 text-white font-semibold py-4 text-lg"
        >
          Check Availability
        </button>
      </div>
    </main>
  );
}
