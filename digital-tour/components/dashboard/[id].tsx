import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";

interface ListingDetail {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  resources: { id: number; type: 'image' | 'video'; url: string; caption?: string }[];
  reviews: { id: number; rating: number; comment: string; user: { name: string } }[];
  bookings: { id: number; status: string }[];
  user: { name: string };
}

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/listings/${id}`)
        .then(res => res.json())
        .then(setListing)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 flex justify-center"><p>Loading trail...</p></div>;
  if (!listing) return <p className="p-8 text-center">Trail not found.</p>;

  const confirmedBookings = listing.bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="mb-4 text-emerald-600 hover:underline text-sm">← Back to Trails</button>
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{listing.description}</p>
            <div className="flex items-center justify-between mb-6">
              <p className="text-emerald-600 font-medium text-xl">ETB {listing.price}/night</p>
              <p className="text-sm text-gray-500">{listing.location}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">Hosted by {listing.user.name}</p>
          </div>
          <div className="space-y-4 text-sm">
            <p>Bookings: {listing.bookings.length} total ({confirmedBookings} confirmed)</p>
            <p>Reviews: {listing.reviews.length}</p>
          </div>
        </div>

        {/* Gallery */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sights & Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listing.resources.map((res) => (
              <div key={res.id} className="bg-white rounded-lg shadow overflow-hidden">
                {res.type === 'image' ? (
                  <Image src={res.url} alt={res.caption || 'Sighting'} width={300} height={200} className="w-full h-40 object-cover" />
                ) : (
                  <video src={res.url} className="w-full h-40 object-cover" controls muted />
                )}
                {res.caption && <p className="p-3 text-sm text-gray-600">{res.caption}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews ({listing.reviews.length})</h2>
          <div className="space-y-4">
            {listing.reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  <span className="ml-2 text-sm text-gray-500">by {review.user.name}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}