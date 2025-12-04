import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropertyDetail from "@/components/property/PropertyDetail";
import BookingSection from "@/components/property/BookingSection";
// import ReviewSection from "@/components/property/ReviewSection";
import CardSkeleton from "@/components/skelotons/CardSkeleton";

// FIX: Import the function directly, matching its named export in listingService.ts
import { getListingById } from "@/services/listingService"; 

// --- START: Interface Update (Restored for completeness) ---
interface ListingDetail {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  media: { id: number; url: string; type: string }[]; 
  reviews: { id: number; rating: number; comment: string; user: { name: string } }[];
}
// --- END: Interface Update ---

export default function TourPage() {
  const router = useRouter();
  const { id } = router.query;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false); 
      return;
    }

    // Reset state before fetching new data
    setListing(null); 
    setError(null);
    setLoading(true); 
    
    // FIX: Call the imported function directly
    getListingById(id as string) 
      .then((data) => {
        setListing({
          id: data.id,
          name: data.name,
          location: data.location,
          price: data.price,
          image: data.resources?.[0]?.url || '/images/default-trail.jpg', 
          description: data.description,
          media: data.resources || [], 
          reviews: data.reviews || []
        });
      })
      .catch((err) => {
        console.error("Failed to load listing", err);
        console.log("Error details:", err.response?.data || err.message); 
        setError("Failed to load trail—retry sync.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <CardSkeleton />;

  if (error || !listing) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error || "Trail not found"}</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 text-slate-900 font-inter">
      <PropertyDetail property={listing} /> 
      <BookingSection listing={listing} />
      {/* <ReviewSection listingId={listing.id} reviews={listing.reviews} /> */}
    </div>
  );
}