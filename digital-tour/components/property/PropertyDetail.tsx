export default function PropertyDetail({ property }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{property.title}</h1>

      {/* Media Gallery */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {property.media.map((m) => (
          <div key={m.id}>
            {m.type === "image" ? (
              <img
                src={m.url}
                className="rounded-lg w-full h-64 object-cover"
                alt=""
              />
            ) : (
              <video
                src={m.url}
                controls
                className="rounded-lg w-full h-64 object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-gray-600">{property.description}</p>
    </div>
  );
}
