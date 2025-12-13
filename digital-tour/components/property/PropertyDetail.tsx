export default function PropertyDetail({ property }: { property: ListingDetail }) {
  return (
    <div className="py-10 p-4">
      {/* Header: Name (was title) */}
      <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
      
      {/* Location & Price */}
      <div className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg">
        <p className="text-xl text-gray-700">📍 {property.location || 'Location TBD'}</p>
        <p className="text-2xl font-bold text-emerald-600">${property.price?.toFixed(2) || 'Price TBD'}</p>
      </div>

      {/* Media Gallery */}
      <div className="grid grid-cols-1 gap-3 mb-8">
        {property.media.map((m) => (
          <div key={m.id}>
            {m.type === "image" ? (
              <img
                src={m.url}
                className="rounded-lg w-full h-96 object-cover"
                alt={property.name}
              />
            ) : (
              <video
                src={m.url}
                controls
                className="rounded-lg w-full h-96 object-cover mt-3"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      <h2 className="text-2xl font-semibold mb-4 bg-gray-200 text-gray-700 p-2 rounded">Description</h2>
      <p className="text-gray-600 leading-relaxed">{property.description}</p>

      {/* Reviews (if any) */}
      {property.reviews && property.reviews.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          {property.reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 mb-4">
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">⭐ {review.rating}/5</span>
                <span className="ml-2 text-sm text-gray-500">by {review.user?.name || 'Anonymous'}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4 italic">No reviews yet.</p>
      )}
    </div>
  );
}