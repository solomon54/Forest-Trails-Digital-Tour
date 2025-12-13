// pages/tours/index.tsx

import { useEffect, useState } from "react";
import { getAllListings } from "@/services/listingService";
import { Listing } from "@/types/admin";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import Link from "next/link";
import UserMenu from "@/components/common/UserMenu";
import Footer from "@/components/layout/Footer";

// Utility function to determine media type from URL extension
const getMediaType = (url: string | null | undefined): 'image' | 'video' | 'placeholder' => {
  if (!url) return 'placeholder';
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.includes('/video/')) {
    return 'video';
  }
  if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg') || lowerUrl.endsWith('.png') || lowerUrl.endsWith('.gif') || lowerUrl.endsWith('.avif') || lowerUrl.includes('/image/')) {
    return 'image';
  }
  return 'placeholder'; // Default to placeholder if unknown
};

// Component for rendering the media card conditionally
interface TourMediaProps {
  url: string;
  name: string;
  location: string | null | undefined;
}

const TourMedia: React.FC<TourMediaProps> = ({ url, name, location }) => {
  const mediaType = getMediaType(url);
  const altText = `${name} - ${location || 'Cover Image'}`;
  const className = "w-full h-48 object-cover rounded-lg flex-shrink-0";
  const placeholder = "/images/placeholder.jpg";

  if (mediaType === 'video') {
    return (
      <video
        src={url}
        controls
        muted
        playsInline
        className={`${className} border border-gray-200 `}
        poster={placeholder} 
        title={altText} >
        Your browser does not support the video tag.
      </video>
    );
  }

  // Covers 'image' and 'placeholder' types
  const imgSrc = mediaType === 'placeholder' ? placeholder : url;
  
  return (
    <img
      src={imgSrc}
      alt={altText}
      className={className}
      onError={(e) => {
        // If image fails to load, use the safe placeholder
        (e.target as HTMLImageElement).src = placeholder;
      }}
    />
  );
};


export default function ToursListingPage() {
  const [tours, setTours] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTours() {
      try {
        setError(null);
        // CRITICAL FIX: Pass status parameter to the service call
        const data = await getAllListings({ status: 'active' }); 
        setTours(data);
      } catch (err) {
        console.error("Error loading tours:", err);
        setError("Failed to load tours. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  if (loading) return <CardSkeleton />;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  if (tours.length === 0) {
    return <div className="p-8 text-center text-slate-600">No tours available at the moment.</div>;
  }

  return (
     <>
         <UserMenu />

    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 mt-6">
      {tours.map((tour) => {
        const priceNum = Number(tour.price) || 0;
        const formattedPrice = priceNum > 0 ? `$${priceNum.toFixed(2)}` : "Price TBD";

        // Get the primary URL, defaulting to placeholder if none exists
        const mediaUrl = tour.url || "/images/placeholder.jpg"; 

        return (
         
          <Link href={`/tours/${tour.id}`} key={tour.id} passHref>
            <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition cursor-pointer text-gray-700 flex flex-col h-full">
              
              {/* Conditional Media Component */}
              <TourMedia url={mediaUrl} name={tour.name} location={tour.location} />

                <h2 className="text-xl bg-gray-100 font-semibold text-green-800 line-clamp-2 border-b border-cyan-800 mt-1">{tour.name}</h2>
              <div className="flex-grow mt-4">
                <p className="text-green-950 "> {tour.description?.slice(0,150)}...</p>
              </div>
              
              <div className="flex justify-between mt-auto pt-2">
                <p className="text-slate-600 line-clamp-1 font-semibold shadow-sm p-2 rounded-full bg-linear-30 from-25% bg-red-600/10 to-indigo-600/10 hover:scale-103 transition duration-500">{tour.location || 'Location TBD'}</p>
                <p className="text-amber-600 font-bold text-lg">{formattedPrice}</p>
                </div>
                {tour.creator && (
                <p className="text-sm text-slate-500 mt-3">By {tour.creator.name}</p> 
                )}
            </div>
          </Link>
        );
      })}
    </div>
    <Footer/>
   </>

  );
}