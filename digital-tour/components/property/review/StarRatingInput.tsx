// components/property/review/StarRatingInput.tsx
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: "small" | "medium" | "large";
}

const sizeMap: Record<string, string> = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
};

export default function StarRatingInput({
  value,
  onChange,
  size = "medium",
}: StarRatingInputProps) {
  const [hover, setHover] = useState(0);
  const currentRating = hover || value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          {star <= currentRating ? (
            <FaStar className={`${sizeMap[size]} text-yellow-400`} />
          ) : (
            <FaRegStar className={`${sizeMap[size]} text-gray-300`} />
          )}
        </button>
      ))}
    </div>
  );
}
