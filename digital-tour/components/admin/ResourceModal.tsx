// components/admin/ResourceModal.tsx
import React, { useState } from "react";
import { Resource } from "@/types/admin";

interface Props {
  resource: Resource | null;
  onClose: () => void;
  onApprove: (id: number, updates?: { caption?: string; description?: string }) => Promise<void>;
  onReject: (id: number, reason?: string) => Promise<void>;
}

export default function ResourceModal({ resource, onClose, onApprove, onReject }: Props) {
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");

  if (!resource) return null;

  // Sync fields when resource changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    setCaption(resource.caption ?? "");
    setDescription(resource.description ?? "");
    setReason("");
  }, [resource]);

  const doApprove = async () => {
    setBusy(true);
    try {
      await onApprove(resource.id, { caption, description });
    } finally { setBusy(false); }
  };

  const doReject = async () => {
    setBusy(true);
    try {
      await onReject(resource.id, reason);
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex gap-4">
          <div className="w-1/2">
            {resource.type === "video" ? (
              <video src={resource.url} controls className="w-full h-64 object-cover" />
            ) : (
              <img src={resource.url} className="w-full h-64 object-cover" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Review resource #{resource.id}</h3>
            <label className="block text-sm mb-1">Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full px-3 py-2 border rounded mb-3" />

            <label className="block text-sm mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded h-28 mb-3" />

            <div className="flex gap-2 mt-2">
              <button onClick={doApprove} disabled={busy} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
              <button onClick={doReject} disabled={busy} className="px-4 py-2 bg-red-600 text-white rounded">Reject</button>
              <button onClick={onClose} className="ml-auto px-4 py-2 border rounded">Close</button>
            </div>

            <div className="mt-3">
              <label className="block text-sm">Rejection reason (optional)</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/*
// components/admin/ResourceModal.tsx
import React, { useState } from 'react';
import { Resource } from '@/types/admin';

interface Props {
  resource: Resource | null;
  onClose: () => void;
  onApprove: (id: number, updates?: any) => Promise<void>;
  onReject: (id: number, reason?: string) => Promise<void>;
}

export default function ResourceModal({ resource, onClose, onApprove, onReject }: Props) {
  const [editingDescription, setEditingDescription] = useState(resource?.description ?? '');
  const [reason, setReason] = useState('');

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-auto p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold">{resource.caption || 'Resource'}</h2>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            {resource.type === 'video' ? (
              <video controls src={resource.url} className="w-full rounded-lg" />
            ) : (
              <img src={resource.url} alt={resource.caption || ''} className="w-full rounded-lg object-cover" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Caption</label>
            <p className="text-sm text-slate-700 mb-3">{resource.caption}</p>

            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
              rows={6}
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onApprove(resource.id, { description: editingDescription })}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Approve & Save
              </button>

              <button
                onClick={() => onReject(resource.id, reason)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Reject
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-sm">Rejection Reason (optional)</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full mt-2 p-2 border rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
*/

