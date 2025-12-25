
// pages/tours/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropertyDetail from "@/components/property/PropertyDetail";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import Footer from "@/components/layout/Footer";

import BookingForm from "@/components/property/booking/BookingForm";
import { getListingById } from "@/services/listingService";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar/Navbar";


// --- Interface ---
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

export default function TourPage() {
  const router = useRouter();
  const { id } = router.query;

  const { user, loading: authLoading } = useAuth();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  // --- Fetch listing ---
  useEffect(() => {
    if (!id) return;

    setListing(null);
    setError(null);
    setLoading(true);

    getListingById(id as string)
      .then((data) => {
        setListing({
          id: data.id,
          name: data.name,
          location: data.location,
          price: data.price,
          image: data.resources?.[0]?.url || "/images/placeholder.png",
          description: data.description,
          media: data.resources || [],
          reviews: data.reviews || [],
        });
      })
      .catch((err) => {
        console.error("Failed to load listing", err);
        setError("Failed to load trail—retry sync.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || authLoading) return <CardSkeleton />;

  if (error || !listing) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error || "Trail not found"}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">You must be logged in to book this tour.</p>
      </div>
    );
  }



  return (
    <div className="bg-neutral-50 text-slate-900 font-inter">

    <Navbar/>

      <PropertyDetail property={listing} />

      {/* --- Booking Form */}
      <div id="bookingForm" className="mt-6">
        <BookingForm
          listingId={listing.id}
          userId={user.id}
          />
      </div>

      <Footer />
    </div>
  );
}
