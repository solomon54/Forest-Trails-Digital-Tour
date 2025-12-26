import Image from "next/image";
import { useState } from "react";

interface Props {
  name?: string;
  imageUrl?: string;
  isOnline?: boolean; // new prop
}

const getInitials = (name?: string) => {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default function ActivityAvatar({ name, imageUrl, isOnline }: Props) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !imageUrl || imageError;

  return (
    <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
      {/* Avatar circle */}
      <div
        className="
          w-full h-full
          rounded-full
          overflow-hidden
          flex items-center justify-center
          bg-indigo-100
          text-indigo-700
          text-sm font-bold
        "
      >
        {showFallback ? (
          <span>{getInitials(name)}</span>
        ) : (
          <Image
            src={imageUrl}
            alt={name ?? "User avatar"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Online/Offline indicator */}
      <span
        className={`
          absolute bottom-0 right-0 w-3 h-3
          rounded-full border-2 border-white
          ${isOnline ? "bg-emerald-700" : "bg-gray-400"}
        `}
      />
    </div>
  );
}
