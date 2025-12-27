// components/property/review/ReviewItem.tsx
import { useState } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import StarRatingDisplay from "./StarRatingDispaly";

interface ReviewUser {
  name?: string;
  photo_url?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  relativeTime?: string;
  reviewUser?: ReviewUser;
}

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const name = review.reviewUser?.name?.trim() || "Anonymous Traveler";
  const [imageError, setImageError] = useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const hasPhoto = !!review.reviewUser?.photo_url && !imageError;

  const paragraphs = review.comment
    ? review.comment.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <li className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0 self-start">
            {hasPhoto ? (
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-4 ring-gray-100">
                <Image
                  src={review.reviewUser!.photo_url!}
                  alt={name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority={false}
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-base sm:text-lg ring-4 ring-gray-100">
                {initials || <FaUserCircle className="w-8 h-8 text-white/90" />}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header: Name, Time, Rating */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-3 mb-3 sm:mb-4">
              <div>
                <h4 className="font-semibold text-base sm:text-lg text-gray-900">
                  {name}
                </h4>
                <time className="text-xs sm:text-sm text-gray-500">
                  {review.relativeTime || "Recently"}
                </time>
              </div>

              <StarRatingDisplay rating={review.rating} size="medium" showValue />
            </div>

            {/* Review Text */}
            {paragraphs.length > 0 ? (
              <div className="relative pl-5 sm:pl-6">
                {/* Left quote */}
                <span className="absolute left-0 top-0 text-3xl sm:text-5xl text-emerald-200 font-serif leading-none">
                  “
                </span>

                <div className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base leading-relaxed italic">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className="relative">{paragraph}</p>
                  ))}
                </div>

                {/* Right quote */}
                <span className="absolute -bottom-2 sm:-bottom-4 right-0 text-3xl sm:text-5xl text-emerald-200 font-serif leading-none">
                  ”
                </span>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm sm:text-base">No written review.</p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
