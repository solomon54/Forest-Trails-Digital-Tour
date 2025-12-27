// import Image from "next/image";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// interface ListingDetail {
//   id: number;
//   name: string;
//   description: string;
//   location: string;
//   price: number;
//   resources: { id: number; type: 'image' | 'video'; url: string; caption?: string }[];
//   reviews: { user: { name: string }; rating: number; comment: string }[];
//   bookings: { status: string }[]; // Summary count
//   user: { name: string };
// }

// export default function ListingDetail() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [listing, setListing] = useState<ListingDetail | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       fetch(`/api/listings/${id}`)
//         .then(res => res.json())
//         .then(setListing)
//         .catch(console.error)
//         .finally(() => setLoading(false));
//     }
//   }, [id]);

//   if (loading) return <div className="p-8 flex justify-center"><p>Loading detail...</p></div>;
//   if (!listing) return <p className="p-8 text-center">Trail not found.</p>;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <button onClick={() => router.back()} className="mb-4 text-emerald-600 hover:underline">← Back to Trails</button>
//         <div className="grid md:grid-cols-2 gap-8 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.name}</h1>
//             <p className="text-gray-600 mb-6">{listing.description}</p>
//             <p className="text-emerald-600 font-medium text-xl">ETB {listing.price}/night • {listing.location}</p>
//             <p className="text-sm text-gray-500 mt-2">Hosted by {listing.user.name}</p>
//           </div>
//           <div className="space-y-4">
//             <p className="text-sm text-gray-500">Bookings: {listing.bookings.length} active ({listing.bookings.filter(b => b.status === 'confirmed').length} confirmed)</p>
//             <p className="text-sm text-gray-500">Reviews: {listing.reviews.length}</p>
//           </div>
//         </div>

//         {/* Resources Gallery */}
//         <section className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Sights & Media</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {listing.resources.map((res) => (
//               <div key={res.id} className="bg-white rounded-lg shadow overflow-hidden">
//                 {res.type === 'image' ? (
//                   <Image src={res.url} alt={res.caption || 'Sighting'} width={300} height={200} className="w-full h-40 object-cover" />
//                 ) : (
//                   <video src={res.url} className="w-full h-40 object-cover" controls muted />
//                 )}
//                 {res.caption && <p className="p-3 text-sm text-gray-600">{res.caption}</p>}
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Reviews */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
//           <div className="space-y-4">
//             {listing.reviews.map((review, i) => (
//               <div key={i} className="bg-white p-4 rounded-lg shadow">
//                 <p className="text-gray-900 font-medium">{review.user.name} ({review.rating}/5)</p>
//                 <p className="text-gray-600 mt-2">{review.comment}</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
