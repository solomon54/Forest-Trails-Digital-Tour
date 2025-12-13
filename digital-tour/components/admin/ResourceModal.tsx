// components/admin/ResourceModal.tsx
import React, { useState, useEffect } from "react";
import { Resource } from "@/types/admin";

// Typed updates
interface Updates {
  caption?: string;
  description?: string;
  location?: string;
  price?: number;
}

interface Props {
  resource: Resource | null;
  onClose: () => void;
  // MODIFIED: Handlers now require adminId
  onApprove: (id: number, updates: Updates | undefined, adminId: number) => Promise<void>; 
  onReject: (id: number, reason: string | undefined, adminId: number) => Promise<void>; 
  busy?: boolean;  
  currentUserId: number; // NEW PROP ADDED
}

export default function ResourceModal({ 
  resource, 
  onClose, 
  onApprove, 
  onReject, 
  busy = false,
  currentUserId // NEW PROP DESTRUCTURED
}: Props) {
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  if (!resource) return null;

  // Sync fields
  useEffect(() => {
    setCaption(resource.caption ?? "");
    setDescription(resource.description ?? "");
    setLocation(resource.resourceListing?.location ?? "");
    setPrice(resource.resourceListing?.price ?? "");
    setReason("");
    setReasonError("");
  }, [resource]);

  const validateReject = (): boolean => {
    // ... validation logic ...
    if (!reason.trim() || reason.trim().length < 10) {
      setReasonError("Rejection reason must be at least 10 characters long.");
      return false;
    }
    setReasonError("");
    return true;
  };
const doApprove = async () => {
  if (busy || !location.trim() || price <= 0) {
    alert('Location and price required for approval.');
    return;
  }
  const updates = { name: caption, description, location, price: Number(price) };
  await onApprove(resource.id, updates, currentUserId);
};

const doReject = async () => {
  if (!validateReject() || busy) return;

  try {
    await onReject(resource.id, reason, currentUserId);
    // don't call onClose here
  } catch (err) {
    console.error("Reject failed:", err);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-gray-100   red rounded-2xl max-w-4xl w-full overflow-auto max-h-[90vh] p-6">
        {/* ... Rest of the UI (omitted for brevity) ... */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl text-green-700 font-semibold">Review & Edit Resource #{resource.id}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-600 text-xl font-bold disabled:opacity-50 "
            disabled={busy}
          >
            ×
          </button>
        </div>
     

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Media Preview */}
          <div className="col-span-1 lg:col-span-1">
            {resource.type === "video" ? (
              <video src={resource.url} controls className="w-full h-64 object-cover rounded-lg" />
            ) : (
              <img src={resource.url} alt={resource.caption} className="w-full h-64 object-cover rounded-lg" />
            )}
            <p className="text-sm text-gray-600 mt-2">Type: {resource.type}</p>
            <p className="text-sm text-gray-600">Status: <span className={`font-medium ${resource.status === 'approved' ? 'text-green-600' : resource.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{resource.status}</span></p>
          </div>

          {/* Edit Form */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <input 
                value={caption} 
                onChange={(e) => setCaption(e.target.value)} 
                className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                disabled={busy}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none" 
                disabled={busy}
                placeholder="Update description for approval sync..."
              />
            </div>

            {/* Location & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (syncs to Listing)</label>
                <input 
                  type="text"
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g., Addis Ababa, Ethiopia"
                  disabled={busy}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (syncs to Listing)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g., 150.00"
                  disabled={busy}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <button 
                onClick={doApprove} 
                disabled={busy || !caption.trim() || !description.trim()} 
                className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {busy ? "Approving..." : "Approve & Sync to Listing"}
              </button>
              <button 
                onClick={doReject} 
                disabled={busy || !reason.trim()} 
                className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {busy ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>

        {/* Rejection Section */}
        <div className="mt-6 p-4 bg-red-50 text-gray-700 border border-red-200 rounded-md">
          <label className="block text-sm font-medium text-red-800 mb-2">Rejection Reason (Required for Feedback)</label>
          <textarea 
            value={reason} 
            onChange={(e) => {
              setReason(e.target.value);
              if (reasonError && e.target.value.length >= 10) setReasonError("");
            }} 
            className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-20" 
            placeholder="Provide detailed reason (e.g., 'Image quality low, blurry details. Suggest reshoot in better lighting. Min 10 chars.')"
            disabled={busy}
          />
          {reasonError && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {reasonError}
            </p>
          )}
          <p className="mt-2 text-xs text-red-600 italic">
            This reason will be logged for user feedback and cannot be approved without it.
          </p>
        </div>
      </div>
    </div>
  );
}