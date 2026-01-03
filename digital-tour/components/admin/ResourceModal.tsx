// components/admin/ResourceModal.tsx
import React, { useState, useEffect } from "react";
import { Resource } from "@/types/admin";

interface Updates {
  caption?: string;
  description?: string;
  location?: string;
  price?: number;
}

interface Props {
  resource: Resource | null;
  onClose: () => void;
  onApprove: (
    id: number,
    updates: Updates | undefined,
    adminId: number
  ) => Promise<void>;
  onReject: (
    id: number,
    reason: string | undefined,
    adminId: number
  ) => Promise<void>;
  busy?: boolean;
  currentUserId: number;
}

export default function ResourceModal({
  resource,
  onClose,
  onApprove,
  onReject,
  busy = false,
  currentUserId,
}: Props) {
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [reason, setReason] = useState("");

  // Inline error states
  const [locationError, setLocationError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [reasonError, setReasonError] = useState("");

  // Reset all errors
  const resetErrors = () => {
    setLocationError("");
    setPriceError("");
    setReasonError("");
  };

  // Sync form on open
  useEffect(() => {
    if (resource) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCaption(resource.caption ?? "");
      setDescription(resource.description ?? "");
      setLocation(
        resource.status === "approved"
          ? resource.resourceListing?.location ?? ""
          : resource.caption ?? ""
      );

      setPrice(resource.resourceListing?.price ?? "");
      setReason("");
      resetErrors();
    }
  }, [resource]);

  // Real-time validation for approve
  const isApproveValid = () => {
    let valid = true;
    resetErrors();

    if (!location.trim()) {
      setLocationError("Location is required");
      valid = false;
    }

    if (price === "" || price <= 0) {
      setPriceError("Valid price greater than 0 is required");
      valid = false;
    } else if (isNaN(Number(price))) {
      setPriceError("Price must be a valid number");
      valid = false;
    }

    return valid;
  };

  // Real-time validation for reject
  const isRejectValid = () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason || trimmedReason.length < 10) {
      setReasonError("Reason must be at least 10 characters");
      return false;
    }
    setReasonError("");
    return true;
  };

  const handleApprove = async () => {
    if (busy || !isApproveValid()) return;

    const updates: Updates = {
      caption: caption.trim() || undefined,
      description: description.trim() || undefined,
      location: location.trim(),
      price: Number(price),
    };

    await onApprove(resource!.id, updates, currentUserId);
  };

  const handleReject = async () => {
    if (busy || !isRejectValid()) return;

    await onReject(resource!.id, reason.trim(), currentUserId);
  };

  // Compute button states based on validation
  const canApprove =
    !busy && location.trim() !== "" && price !== "" && Number(price) > 0;
  const canReject = !busy && reason.trim().length >= 10;

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, busy]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !busy) {
      onClose();
    }
  };

  if (!resource) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-start p-6 border-b border-gray-200">
          <div>
            <h2
              id="modal-title"
              className="text-xl md:text-2xl font-bold text-gray-900">
              Review Resource #{resource.id}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Edit details and approve or reject submission
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="text-gray-600 hover:text-red-600 text-3xl leading-none disabled:opacity-50 transition-transform hover:scale-110"
            aria-label="Close modal"
            type="button">
            &times;
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-8 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-8 xl:grid-cols-3">
          {/* Media Preview - Mobile first, then right side on desktop */}
          <div className="lg:col-span-1 xl:order-2">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden bg-gray-100">
                {resource.type === "video" ? (
                  <video
                    src={resource.url}
                    controls
                    className="w-full aspect-video object-cover"
                    aria-label={`Video resource: ${
                      resource.caption || "Untitled"
                    }`}
                  />
                ) : (
                  <img
                    src={resource.url}
                    alt={resource.caption || "Resource image"}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="space-y-2 text-sm p-3 bg-gray-50 rounded-lg">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="text-gray-900">
                    {resource.type.charAt(0).toUpperCase() +
                      resource.type.slice(1)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`font-semibold ${
                      resource.status === "pending"
                        ? "text-yellow-600"
                        : resource.status === "approved"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}>
                    {resource.status.charAt(0).toUpperCase() +
                      resource.status.slice(1)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="text-gray-900">
                    {new Date(resource.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Form - Takes full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 text-gray-500 xl:order-1 space-y-6">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label
                  htmlFor="caption-input"
                  className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Caption
                </label>
                <input
                  id="caption-input"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={busy}
                  className="w-full  px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/70 disabled:bg-gray-100 transition text-sm md:text-base"
                  placeholder="Enter a descriptive caption"
                />
              </div>

              <div>
                <label
                  htmlFor="description-input"
                  className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Description
                </label>
                <textarea
                  id="description-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={busy}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/70 disabled:bg-gray-100 resize-y transition text-sm md:text-base"
                  placeholder="Provide detailed description of the resource"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="location-input"
                    className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location-input"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (locationError) setLocationError("");
                    }}
                    disabled={busy}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-100 transition text-sm md:text-base ${
                      locationError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-emerald-600/70"
                    }`}
                    placeholder="e.g., New York, USA"
                  />
                  {locationError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span className="text-lg" aria-hidden="true">
                        ⚠
                      </span>{" "}
                      {locationError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price-input"
                    className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      id="price-input"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => {
                        const val =
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value);
                        setPrice(val);
                        if (priceError) setPriceError("");
                      }}
                      disabled={busy}
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-100 transition text-sm md:text-base ${
                        priceError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-600/70"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {priceError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <span className="text-lg" aria-hidden="true">
                        ⚠
                      </span>{" "}
                      {priceError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rejection Reason - Only show when needed */}
            <div className="p-4 md:p-5 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <label
                htmlFor="reject-reason-input"
                className="block text-sm font-semibold text-red-900">
                Rejection Reason <span className="text-red-600">*</span>
                <span className="block text-xs font-normal text-red-700 mt-1">
                  Required only if rejecting (min. 10 characters)
                </span>
              </label>
              <textarea
                id="reject-reason-input"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (reasonError && e.target.value.trim().length >= 10) {
                    setReasonError("");
                  }
                }}
                disabled={busy}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-y transition text-sm md:text-base ${
                  reasonError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-red-300 focus:ring-red-500"
                }`}
                placeholder="Provide specific, constructive feedback for the user..."
              />
              {reasonError && (
                <p className="text-sm text-red-700 flex items-center gap-1">
                  <span className="text-lg" aria-hidden="true">
                    ⚠
                  </span>{" "}
                  {reasonError}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleApprove}
                disabled={!canApprove}
                className={`flex-1 px-6 py-3.5 font-medium rounded-lg transition shadow-sm text-sm md:text-base ${
                  canApprove
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
                    : "bg-emerald-600 text-gray-100 cursor-not-allowed opacity-60"
                }`}
                type="button">
                {busy ? "Approving..." : "Approve & Sync to Listing"}
              </button>

              <button
                onClick={handleReject}
                disabled={!canReject}
                className={`flex-1 px-6 py-3.5 font-medium rounded-lg transition shadow-sm text-sm md:text-base ${
                  canReject
                    ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                    : "bg-red-600 text-gray-100 cursor-not-allowed opacity-60"
                }`}
                type="button">
                {busy ? "Rejecting..." : "Reject Resource"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
