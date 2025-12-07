// components/admin/ResourcesCard.tsx
import React from 'react';
import { Resource } from '@/types/admin';
import Link from 'next/link';

interface Props {
  resource: Resource;
  onClick?: (r: Resource) => void;
}

export default function ResourcesCard({ resource, onClick }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex gap-4">
      <div className="w-36 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        {resource.type === 'video' ? (
          <video src={resource.url} className="w-full h-full object-cover" />
        ) : (
          <img src={resource.url} alt={resource.caption || ''} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{resource.caption || 'Untitled'}</h3>
        <p className="text-xs text-slate-500 mt-1">{resource.description || 'No description'}</p>
        <p className="text-xs text-slate-400 mt-2">
          Listing: {resource.listing?.name ?? resource.listing_id} • Uploaded: {new Date(resource.created_at).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className={`text-xs px-2 py-1 rounded-full ${resource.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : resource.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {resource.status}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onClick?.(resource)}
            className="px-3 py-1 rounded-md border border-slate-200 text-sm hover:bg-slate-50"
          >
            Open
          </button>
          <Link href={`/admin/resources/${resource.id}`}>
            <a className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm hover:opacity-95">Detail</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
