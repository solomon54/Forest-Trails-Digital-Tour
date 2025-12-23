// import { useEffect, useState, ChangeEvent } from "react";
// import { useRouter } from "next/router";
// import { adminListingService} from "@/services/adminService";
// import CardSkeleton from "@/components/skelotons/CardSkeleton";
// import { Listing } from "@/types/admin";  // Assume typed

// interface Resource {
//   id: number;
//   type: 'image' | 'video';
//   url: string;
//   caption?: string;
//   description?: string;
//   status: 'pending' | 'approved' | 'rejected';
//   reason_for_rejection?: string;
//   locked_by?: number;
//   lock_expires_at?: string;
// }

// interface AdminListing extends Listing {
//   lock_user_id: any;
//   status: string;
//   lock_until: string | number | Date;
//   editing: boolean;
//   tempName: string;
//   tempDesc: string;
//   tempLocation: string;
//   tempPrice: string;
//   tempStatus: 'pending' | 'approved' | 'rejected';
// }

// type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

// export default function AdminListingsPage() {
//   const router = useRouter();
//   const [listings, setListings] = useState<AdminListing[]>([]);
//   const [filter, setFilter] = useState<FilterType>('all');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editingId, setEditingId] = useState<number | null>(null);

//   useEffect(() => {
//     fetchListings();
//     const pollInterval = setInterval(fetchListings, 15000);
//     return () => clearInterval(pollInterval);
//   }, [filter]);

//   const fetchListings = async (): Promise<void> => {
//     try {
//       setError(null);
//       setLoading(true);
//       const data = await getAllAdminListings(filter);
//       setListings(data.map((l: Listing) => ({
//         ...l,
//         editing: false,
//         tempName: l.name,
//         tempDesc: l.description,
//         tempLocation: l.location,
//         tempPrice: l.price.toString(),  // Ensure string for input
//         tempStatus: l.status
//       })));
//     } catch (err: unknown) {
//       setError("Failed to load listings");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startEdit = async (id: number): Promise<void> => {
//     const listing = listings.find(l => l.id === id);
//     if (listing && !listing.lock_user_id) {
//       await lockListing(id);
//       setEditingId(id);
//       setListings(prev => prev.map(l => l.id === id ? { ...l, editing: true } : l));
//     } else {
//       alert(`Locked by Admin ${listing?.lock_user_id} until ${listing?.lock_until}.`);
//     }
//   };

//   const saveEdit = async (id: number): Promise<void> => {
//     const listing = listings.find(l => l.id === id);
//     if (!listing) return;

//     try {
//       const updated = await updateListing(id, {
//         name: listing.tempName,
//         description: listing.tempDesc,
//         location: listing.tempLocation,
//         price: parseFloat(listing.tempPrice),
//         status: listing.tempStatus
//       });
//       await releaseLock(id);
//       setListings(prev => prev.map(l => l.id === id ? { ...updated, editing: false } : l));
//       setEditingId(null);
//     } catch (err: unknown) {
//       setError("Save failed");
//       console.error(err);
//     }
//   };

//   const cancelEdit = async (id: number): Promise<void> => {
//     await releaseLock(id);
//     setListings(prev => prev.map(l => l.id === id ? { ...l, editing: false } : l));
//     setEditingId(null);
//   };

//   const softDelete = async (id: number): Promise<void> => {
//     if (confirm("Soft-delete this listing?")) {
//       await deleteListing(id);
//       await fetchListings();
//     }
//   };

//   const updateStatus = async (id: number, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
//     const listing = listings.find(l => l.id === id);
//     if (listing) {
//       await updateListing(id, { status });
//       setListings(prev => prev.map(l => l.id === id ? { ...l, tempStatus: status, status } : l));
//     }
//   };

//   const handleInputChange = (id: number, field: keyof AdminListing, value: string): void => {
//     setListings(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
//   };

//   const handleStatusChange = (id: number, value: 'pending' | 'approved' | 'rejected'): void => {
//     setListings(prev => prev.map(l => l.id === id ? { ...l, tempStatus: value } : l));
//   };

//   if (loading) return <CardSkeleton />;
//   if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

//   const filteredListings = listings.filter(l => filter === 'all' || l.status === filter);

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Admin: Manage Listings</h1>
      
//       {/* Filters */}
//       <div className="mb-4 flex space-x-4">
//         {(['all', 'pending', 'approved', 'rejected'] as FilterType[]).map(f => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-4 py-2 rounded ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border rounded-lg">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left">ID</th>
//               <th className="px-4 py-2 text-left">Name</th>
//               <th className="px-4 py-2 text-left">Location</th>
//               <th className="px-4 py-2 text-left">Price</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Creator</th>
//               <th className="px-4 py-2 text-left">Lock</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredListings.map((listing) => (
//               <tr key={listing.id} className="border-t hover:bg-gray-50">
//                 <td className="px-4 py-2">{listing.id}</td>
//                 <td className="px-4 py-2">
//                   {listing.editing ? (
//                     <input
//                       value={listing.tempName}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(listing.id, 'tempName', e.target.value)}
//                       className="border p-1 w-full"
//                     />
//                   ) : (
//                     <span>{listing.name}</span>
//                   )}
//                 </td>
//                 <td className="px-4 py-2">
//                   {listing.editing ? (
//                     <input
//                       value={listing.tempLocation}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(listing.id, 'tempLocation', e.target.value)}
//                       className="border p-1 w-full"
//                     />
//                   ) : (
//                     listing.location
//                   )}
//                 </td>
//                 <td className="px-4 py-2">
//                   {listing.editing ? (
//                     <input
//                       type="number"
//                       value={listing.tempPrice}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(listing.id, 'tempPrice', e.target.value)}
//                       className="border p-1 w-20"
//                     />
//                   ) : (
//                     `$${listing.price}`
//                   )}
//                 </td>
//                 <td className="px-4 py-2">
//                   <span className={`px-2 py-1 rounded text-xs ${
//                     listing.status === 'approved' ? 'bg-green-100 text-green-800' :
//                     listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {listing.status}
//                   </span>
//                   {listing.editing && (
//                     <select
//                       value={listing.tempStatus}
//                       onChange={(e: ChangeEvent<HTMLSelectElement>) => handleStatusChange(listing.id, e.target.value as 'pending' | 'approved' | 'rejected')}
//                       className="ml-2 border p-1"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="approved">Approved</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   )}
//                 </td>
//                 <td className="px-4 py-2">{listing.creator?.name}</td>
//                 <td className="px-4 py-2">
//                   {listing.lock_user_id ? (
//                     <span className="text-sm text-orange-600">Locked by {listing.lock_user_id} until {new Date(listing.lock_until!).toLocaleString()}</span>
//                   ) : (
//                     <span className="text-sm text-gray-500">Free</span>
//                   )}
//                 </td>
//                 <td className="px-4 py-2">
//                   {!listing.editing ? (
//                     <>
//                       <button onClick={() => startEdit(listing.id)} className="bg-blue-500 text-white px-2 py-1 rounded mr-1">Edit</button>
//                       <button onClick={() => updateStatus(listing.id, 'approved')} disabled={listing.status === 'approved'} className="bg-green-500 text-white px-2 py-1 rounded mr-1 disabled:opacity-50">Approve</button>
//                       <button onClick={() => updateStatus(listing.id, 'rejected')} disabled={listing.status === 'rejected'} className="bg-red-500 text-white px-2 py-1 rounded mr-1 disabled:opacity-50">Reject</button>
//                       <button onClick={() => softDelete(listing.id)} className="bg-gray-500 text-white px-2 py-1 rounded">Delete</button>
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={() => saveEdit(listing.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-1">Save</button>
//                       <button onClick={() => cancelEdit(listing.id)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Resources Sub-Table (when editing) */}
//       {editingId && (
//         <div className="mt-4">
//           <h3 className="text-lg font-semibold mb-2">Resources for {listings.find(l => l.id === editingId)?.name}</h3>
//           <table className="min-w-full bg-white border rounded">
//             <thead>
//               <tr><th>ID</th><th>Type</th><th>URL</th><th>Status</th><th>Actions</th></tr>
//             </thead>
//             <tbody>
//               {listings.find(l => l.id === editingId)?.resources?.map((res: Resource) => (
//                 <tr key={res.id}>
//                   <td>{res.id}</td>
//                   <td>{res.type}</td>
//                   <td><a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a></td>
//                   <td>{res.status}</td>
//                   <td>
//                     <button onClick={() => updateResourceStatus(res.id, 'approved')} className="bg-green-500 text-white px-2 py-1 rounded mr-1">Approve</button>
//                     <button onClick={() => updateResourceStatus(res.id, 'rejected')} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
//                   </td>
//                 </tr>
//               )) || <tr><td colSpan={5}>No resources</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {filteredListings.length === 0 && <p className="text-center text-gray-500 mt-4">No listings match filter.</p>}
//     </div>
//   );
// }