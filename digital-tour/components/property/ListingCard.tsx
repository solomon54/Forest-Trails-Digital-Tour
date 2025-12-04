import Image from "next/image";
import Link from "next/link";

interface ListingCardProps {
  listing: {
    id: number;
    name: string;
    description: string;
    location: string;
    price: number;
    resources: { id: number; type: 'image' | 'video'; url: string; caption?: string }[];
    href?: string;
  };
  className?: string;
}

export default function ListingCard({ listing, className = '', href }: ListingCardProps) {
  const cardContent = (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      {listing.resources[0]?.type === 'image' ? (
        <Image
          src={listing.resources[0].url}
          alt={listing.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
      ) : (
        <video src={listing.resources[0]?.url || ''} className="w-full h-48 object-cover" muted />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{listing.name}</h2>
        <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{listing.description}</p>
        <p className="text-emerald-600 font-medium text-base">ETB {listing.price}/night • {listing.location}</p>
      </div>
    </div>
  );

  return href ? <Link href={href} className="block no-underline">{cardContent}</Link> : cardContent;
}