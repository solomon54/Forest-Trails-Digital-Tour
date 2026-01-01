// components/property/PropertyCard.tsx
import Link from "next/link";

interface PropertyCardProps {
  id?: number | string;
  name: string;
  location: string;
  price: number;
  image: string;
}

const PropertyCard = ({
  id,
  name,
  location,
  price,
  image,
}: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 text-slate-900">
          {name}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 mb-2">{location}</p>
        {/* <p className="text-md sm:text-lg md:text-xl text-emerald-600 font-medium">${price}</p> */}

        {id && (
          <Link href={`/tours/${id}`}>
            <button className="mt-3 px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-medium w-full sm:w-auto">
              View Details
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
