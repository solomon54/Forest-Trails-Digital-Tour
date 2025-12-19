
// pages/tours/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PropertyDetail from "@/components/property/PropertyDetail";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import Footer from "@/components/layout/Footer";
import UserMenu from "@/components/users/UserProfile";
import BookingForm from "@/components/property/booking/BookingForm";
import { getListingById } from "@/services/listingService";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

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

  // --- Check availability before showing booking form ---
  const checkAvailability = async (start_date: string, end_date: string) => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        listing_id: listing.id,
        start_date,
        end_date,
      });
      setAvailabilityMessage(data.available ? null : "This listing is already booked for the selected dates.");
      return data.available;
    } catch (err: any) {
      console.error("Availability check failed", err);
      setAvailabilityMessage("Failed to check availability. Please try again.");
      return false;
    }
  };

  return (
    <div className="bg-neutral-50 text-slate-900 font-inter">
      <UserMenu />
      <PropertyDetail property={listing} />

      {/* --- Booking Form with Availability Check --- */}
      <div id="bookingForm" className="mt-6">
        <BookingForm
          listingId={listing.id}
          userId={user.id}
          checkAvailability={checkAvailability} // <-- pass pre-check logic to form
        />
      </div>

      {/* <ReviewSection listingId={listing.id} reviews={listing.reviews} /> */}
      <Footer />
    </div>
  );
}
