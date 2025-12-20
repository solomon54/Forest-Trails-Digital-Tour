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
  const name = review.reviewUser?.name || "Anonymous";
  const [imageError, setImageError] = useState(false);

  const initials = name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const showImage = !!review.reviewUser?.photo_url && !imageError;

  // Split comment into paragraphs
  const paragraphs = review.comment
    ? review.comment.split(/\n+/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <li className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="shrink-0">
          {showImage ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={review.reviewUser!.photo_url!}
                alt={name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
              {initials || <FaUserCircle className="w-8 h-8 text-gray-400" />}
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-gray-900 truncate">{name}</p>
              <p className="text-sm text-gray-500">
                {review.relativeTime || "Just now"}
              </p>
            </div>
            <StarRatingDisplay rating={review.rating} size="medium" showValue />
          </div>

          {/* Comment with quotes */}
          {paragraphs.length > 0 && (
            <blockquote className="relative text-gray-700 pl-5 border-l-6 border-emerald-700/80 italic ">
              <span className="absolute -left-0 top-0 text-3xl text-emerald-600 font-serif font-semibold">
                “
              </span>
              <div className="flex flex-col gap-2 text-sm sm:text-base leading-relaxed wrap-break-word">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <span className="absolute -right-1 bottom-0 text-3xl text-emerald-600 font-serif font-semibold">
                ”
              </span>
            </blockquote>
          )}
        </div>
      </div>
    </li>
  );
}
