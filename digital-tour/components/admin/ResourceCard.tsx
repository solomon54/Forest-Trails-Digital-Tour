// components/admin/ResourceCard.tsx
import React, { useState, useEffect } from "react";
import { Resource } from "@/types/admin";
import { HiLockClosed, HiClock } from "react-icons/hi";

interface Props {
  resource: Resource & { locker?: { id: number; name: string } };
  onClick: (r: Resource) => void;
  currentUserId: number;
  isAppBusy: boolean;
}

export default function ResourceCard({
  resource,
  onClick,
  currentUserId,
  isAppBusy,
}: Props) {
  const [expiryCountdown, setExpiryCountdown] = useState<string>("");

  // Lock status
  const isLocked = !!resource.locked_by;
  const isLockedByMe = resource.locked_by === currentUserId;
  const isLockedByOther = isLocked && !isLockedByMe;
  const isDisabled = isLocked || isAppBusy;

  // Countdown timer
  useEffect(() => {
    if (!isLocked || !resource?.lock_expires_at) {
      setExpiryCountdown("");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(resource.lock_expires_at);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setExpiryCountdown("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setExpiryCountdown(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [resource.lock_expires_at, isLocked]);

  const lockInfo = isLockedByOther
    ? `Locked by ${resource.locker?.name || `Admin ${resource.locked_by}`}`
    : isLockedByMe
    ? "Your lock"
    : null;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
      role="button"
      tabIndex={0}
      onClick={() => !isDisabled && onClick(resource)}
      onKeyDown={(e) => e.key === "Enter" && !isDisabled && onClick(resource)}
    >
      <div className="p-5 flex flex-col gap-5 md:flex-row md:items-center">
        {/* Thumbnail - Full width on mobile, fixed on larger */}
        <div className="w-full md:w-40 lg:w-48 h-48 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          {resource.type === "video" ? (
            <video
              src={resource.url}
              className="w-full h-full object-cover"
              muted
              playsInline
              loading="lazy"
            />
          ) : resource.url ? (
            <img
              src={resource.url}
              alt={resource.caption || "Resource preview"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No preview available
            </div>
          )}
        </div>

        {/* Main Content & Actions - Stacked on mobile */}
        <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
          {/* Text Content */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
              {resource.caption || "Untitled Resource"}
            </h3>

            {resource.description ? (
              <p className="text-sm text-gray-600 line-clamp-3">
                {resource.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">No description provided</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span>Listing ID: {resource.listing_id}</span>
              <span className="hidden sm:inline">•</span>
              <span className="block sm:inline">
                {new Date(resource.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Badges & Button - Bottom section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Left: Status + Lock Info */}
            <div className="flex flex-col gap-2">
              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full w-fit ${
                  resource.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : resource.status === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
              </span>

              {/* Lock Info */}
              {isLocked && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 w-fit">
                    <HiLockClosed className="text-sm" />
                    {lockInfo}
                  </span>
                  {expiryCountdown && (
                    <span className="flex items-center gap-1 text-gray-500 ml-1">
                      <HiClock className="text-sm" />
                      {expiryCountdown}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                !isDisabled && onClick(resource);
              }}
              disabled={isDisabled}
              className={`
                px-6 py-3 text-sm font-medium rounded-lg transition-all shadow-sm
                ${isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
                }
              `}
            >
              {isLockedByOther ? "Locked" : isLockedByMe ? "Continue Review" : "Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}