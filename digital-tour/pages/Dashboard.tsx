import UploadBox from "@/components/dashboard/UploadBox";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Resource {
  id: number;
  caption?: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'image' | 'video';
  media?: { url: string; type: 'image' | 'video' }[];
  user?: { name: string };
}

interface DashboardData {
  pending: Resource[];
  approved: Resource[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({ pending: [], approved: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then(res => res.json())
      .then((res: { pending: Resource[]; approved: Resource[] }) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id: number, newStatus: 'approved' | 'rejected') => {
    await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    // Refresh data
    window.location.reload();
  };

  if (loading) return <div className="p-6 flex justify-center"><p>Loading mod queue...</p></div>;

  return (

    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hero Grid: Approved Sightings Visuals (look feel) */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">Vetted Trail Insights</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.approved.slice(0, 8).map((r) => (
            <div key={r.id} className="bg-white rounded-lg shadow overflow-hidden">
              {r.media?.[0]?.type === 'image' ? (
                <Image src={r.media[0].url} alt={r.caption || 'Trail sighting'} width={200} height={150} className="w-full h-32 object-cover" />
              ) : (
                <video src={r.media?.[0]?.url || ''} className="w-full h-32 object-cover" />
              )}
              <p className="p-2 text-sm text-gray-600 truncate">{r.caption}</p>
              <p className="p-2 text-xs text-emerald-600">By {r.user?.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mod Queue Table: Pending for Parallel Approvals */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Moderation Queue</h2>
        {data.pending.length === 0 ? (
          <p className="text-gray-500">No pending sightings—check back for ranger syncs.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2 text-left">Preview</th>
                <th className="border px-4 py-2 text-left">Caption</th>
                <th className="border px-4 py-2 text-left">Type</th>
                <th className="border px-4 py-2 text-left">Uploader</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.pending.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {r.media?.[0]?.type === 'image' ? (
                      <Image src={r.media[0].url} alt="Preview" width={50} height={50} className="rounded" />
                    ) : (
                      <video src={r.media?.[0]?.url || ''} className="w-12 h-12 rounded" />
                    )}
                  </td>
                  <td className="border px-4 py-2 max-w-xs truncate">{r.caption}</td>
                  <td className="border px-4 py-2">{r.type}</td>
                  <td className="border px-4 py-2">{r.user?.name}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => toggleStatus(r.id, 'approved')}
                      className="px-3 py-1 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => toggleStatus(r.id, 'rejected')}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}