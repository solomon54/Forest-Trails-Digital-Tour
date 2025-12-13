// components/admin/ResourceCard.tsx
import React, { useState, useEffect } from "react";
import { Resource } from "@/types/admin";

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
  isAppBusy
}: Props) {

  const [expiryCountdown, setExpiryCountdown] = useState<string>("");

  // --- Lock Status Calculations ---
  const isLocked = !!resource.locked_by;
  const isLockedByMe = resource.locked_by === currentUserId;
  const isLockedByOther = isLocked && !isLockedByMe;
  const isDisabled = isLocked || isAppBusy;
  // ---------------------------------

  // Countdown timer
  useEffect(() => {
    if (!isLocked || !resource.lock_expires_at) return;

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
    ? `Locked by ${resource.locker?.name || `User ${resource.locked_by}`} • ${expiryCountdown}`
    : isLockedByMe
    ? `Your lock • ${expiryCountdown}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4">
      {/* Thumbnail */}
      <div className="w-32 h-20 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
        {resource.type === "video" ? (
          <video src={resource.url} className="w-full h-full object-cover" muted />
        ) : (
          <img src={resource.url} alt={resource.caption ?? "resource"} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Middle Content */}
      <div className="flex-1">
        <h3 className="font-semibold">{resource.caption ?? "Untitled"}</h3>
        <p className="text-sm text-slate-500 mt-1">{resource.description ?? "No description"}</p>
        <div className="text-xs text-slate-400 mt-2">
          Listing: {resource.listing_id} • {new Date(resource.created_at).toLocaleString()}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col gap-2 items-end">

        {/* Status Badge */}
        <span
          className={`px-2 py-1 rounded text-xs ${
            resource.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : resource.status === "approved"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {resource.status}
        </span>

        {/* Lock Badge */}
        {isLocked && (
          <span className="px-3 py-1 rounded text-xs bg-gray-100 text-gray-700 max-w-xs break-words">
            {lockInfo}
          </span>
        )}

        {/* Review Button */}
        <button
          onClick={() => !isDisabled && onClick(resource)}
          disabled={isDisabled}
          title={isLocked ? lockInfo ?? "" : "Open for review"}
          className="text-sm px-3 py-1 bg-emerald-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLocked ? "Locked" : "Review"}
        </button>
      </div>
    </div>
  );
}
