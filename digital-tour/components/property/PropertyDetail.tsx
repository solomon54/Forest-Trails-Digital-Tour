import { MdLocationOn } from "react-icons/md";
import { FaDollarSign, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

export default function PropertyDetail({ property }: { property: ListingDetail }) {
  const averageRating =
    property.reviews?.length
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
        property.reviews.length
      : 0;

  const reviewCount = property.reviews?.length || 0;

  const scrollToBooking = () => {
    document
      .getElementById("bookingForm")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i === fullStars + 1 && hasHalf)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
  };

  const descriptionParagraphs = property.description
    ?.split("\n")
    .filter((p) => p.trim());

  return (
    <>
      <div className="max-w-6xl mx-auto py-10 px-4 lg:px-0">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{property.name}</h1>

        {/* Location, Price & CTA */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6 mb-8">
          {/* Location */}
          <div className="flex items-center gap-3 text-gray-700">
            <MdLocationOn className="w-7 h-7 text-emerald-600" />
            <span className="text-lg font-medium">
              {property.location || "Location TBD"}
            </span>
          </div>

          {/* Price + Rating + CTA */}
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
                <span className="text-sm text-gray-600 font-medium">
                  {averageRating.toFixed(1)} ({reviewCount} reviews)
                </span>
              </div>
            )}

            {/* 🔥 Primary CTA */}
            <button
              onClick={scrollToBooking}
              className="mt-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-8 py-3 rounded-xl shadow-md transition"
            >
              Check Availability
            </button>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {property.media.map((m, index) => (
            <div
              key={m.id}
              className={`overflow-hidden rounded-xl shadow-lg ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {m.type === "image" ? (
                <img
                  src={m.url}
                  alt={`${property.name} ${index + 1}`}
                  className="w-full h-96 object-cover hover:scale-105 transition-transform"
                />
              ) : (
                <video src={m.url} controls className="w-full h-96 object-cover" />
              )}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-5">Description</h2>
          <div className="text-gray-600 space-y-4">
            {descriptionParagraphs?.length ? (
              descriptionParagraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="italic">No description available.</p>
            )}
          </div>
        </div>


      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Guest Reviews {reviewCount > 0 && `(${reviewCount})`}
        </h2>

        {reviewCount > 0 ? (
          <div className="space-y-6">
            {property.reviews!.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <p className="font-semibold text-gray-900">
                        {review.user?.name || "Anonymous"}
                      </p>

                      <div className="flex items-center gap-2 text-lg">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500 italic text-lg">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
      </div>

      {/* 📱 Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg sm:hidden">
        <button
          onClick={scrollToBooking}
          className="w-full bg-emerald-600 text-white font-semibold py-4 text-lg"
        >
          Check Availability
        </button>
      </div>
    </>
  );
}
