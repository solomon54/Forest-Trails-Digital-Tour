// pages/admin/resources/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { adminService } from '@/services/adminService';
import { Resource } from '@/types/admin';

export default function ResourceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [resource, setResource] = useState<Resource | null>(null);

  useEffect(() => {
    if (!id) return;
    adminService.getResourceById(Number(id)).then(setResource).catch(console.error);
  }, [id]);

  if (!resource) return <AdminLayout><div>Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">{resource.caption || 'Resource'}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {resource.type === 'video' ? (
            <video src={resource.url} controls className="w-full rounded-lg" />
          ) : (
            <img src={resource.url} alt={resource.caption || ''} className="w-full rounded-lg object-cover" />
          )}
        </div>

        <aside className="p-4 bg-white rounded-xl shadow">
          <p className="text-sm text-slate-600">Listing: {resource.listing?.name ?? resource.listing_id}</p>
          <p className="text-sm mt-2">{resource.description}</p>

          <div className="mt-4 flex gap-2">
            <button onClick={() => adminService.approveResource(resource.id).then(() => router.back())}
              className="px-3 py-2 bg-green-600 text-white rounded">Approve</button>
            <button onClick={() => adminService.rejectResource(resource.id).then(() => router.back())}
              className="px-3 py-2 bg-red-600 text-white rounded">Reject</button>
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}







// // pages/api/admin/resources/[id].ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { sequelize, Resource } from "@/models";
// import { Op } from "sequelize";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // TODO: authenticate admin & set adminId from token/session
//   const adminId = req.headers["x-admin-id"] ? Number(req.headers["x-admin-id"]) : null;

//   if (!adminId) {
//     //For now allow; in production reject
//     // return res.status(403).json({ message: "Admin required" });
//   }

//   const { id } = req.query;

//   try {
//     await sequelize.authenticate();

//     if (req.method === "POST") {
//       // action endpoint: ?action=lock|unlock|approve|reject
//       const action = req.query.action;
//       if (!action) return res.status(400).json({ message: "action is required" });

//       const resource = await Resource.findByPk(Number(id));
//       if (!resource) return res.status(404).json({ message: "Resource not found" });

//       if (action === "lock") {
//         // Only lock if not locked or locked by same admin or locked long time ago
//         if (resource.get("locked_by") && resource.get("locked_by") !== adminId) {
//           return res.status(409).json({ message: "Locked by another admin" });
//         }
//         resource.set("locked_by", adminId);
//         resource.set("locked_at", new Date());
//         await resource.save();
//         return res.status(200).json(resource);
//       }

//       if (action === "unlock") {
//         // Only locker or an override admin can unlock (simplified)
//         resource.set("locked_by", null);
//         resource.set("locked_at", null);
//         await resource.save();
//         return res.status(200).json(resource);
//       }

//       if (action === "approve") {
//         resource.set("status", "approved");
//         resource.set("rejection_reason", null);
//         resource.set("locked_by", null);
//         resource.set("locked_at", null);
//         await resource.save();
//         // Optionally copy to listings table or update listing data here if required
//         return res.status(200).json(resource);
//       }

//       if (action === "reject") {
//         const { reason } = req.body;
//         resource.set("status", "rejected");
//         resource.set("rejection_reason", reason || null);
//         resource.set("locked_by", null);
//         resource.set("locked_at", null);
//         await resource.save();
//         return res.status(200).json(resource);
//       }

//       return res.status(400).json({ message: "Unknown action" });
//     }

//     if (req.method === "PUT") {
//       // Edit caption/description/listing_id etc.
//       const payload = req.body;
//       const resource = await Resource.findByPk(Number(id));
//       if (!resource) return res.status(404).json({ message: "Resource not found" });

//       // If locked by another admin, forbid
//       if (resource.get("locked_by") && resource.get("locked_by") !== adminId) {
//         return res.status(409).json({ message: "Locked by another admin" });
//       }

//       await resource.update({
//         caption: payload.caption ?? resource.get("caption"),
//         description: payload.description ?? resource.get("description"),
//         listing_id: payload.listing_id ?? resource.get("listing_id"),
//       });

//       return res.status(200).json(resource);
//     }

//     // GET single resource
//     if (req.method === "GET") {
//       const resource = await Resource.findByPk(Number(id));
//       if (!resource) return res.status(404).json({ message: "Resource not found" });
//       return res.status(200).json(resource);
//     }

//     res.setHeader("Allow", ["GET", "POST", "PUT"]);
//     res.status(405).end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: (err as Error).message });
//   }
// }
