// components/property/review/StarRatingDisplay.tsx
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingDisplayProps {
  rating: number;
  size?: "small" | "medium" | "large";
  showValue?: boolean;
}

const sizeMap: Record<string, string> = {
  small: "text-sm",
  medium: "text-lg",
  large: "text-xl",
};

export default function StarRatingDisplay({
  rating,
  size = "medium",
  showValue = false,
}: StarRatingDisplayProps) {
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

  return (
    <div className={`flex items-center gap-2 ${sizeMap[size]}`}>
      <div className="flex">{stars}</div>
      {showValue && (
        <span className="text-sm text-gray-500">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
}
