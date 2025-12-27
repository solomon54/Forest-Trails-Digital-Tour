// pages/tours/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import CardSkeleton from "@/components/skelotons/CardSkeleton";

import PropertyDetail from "@/components/property/PropertyDetail";
import BookingForm from "@/components/property/booking/BookingForm";

import { getListingById } from "@/services/listingService";
import { useAuth } from "@/hooks/useAuth";

/* =======================
   Types
======================= */
interface ListingDetail {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  description: string;
  media: { id: number; url: string; type: string }[];
  reviews: {
    id: number;
    rating: number;
    comment: string;
    user: { name: string };
  }[];
}

export default function TourPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref for the Sign In button (non-logged-in user)
  const signInRef = useRef<HTMLDivElement>(null);

  /* =======================
     Fetch Listing (PUBLIC)
======================= */
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

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
      .catch(() => setError("Failed to load tour details."))
      .finally(() => setLoading(false));
  }, [id]);

  /* =======================
     Page States
======================= */
  if (loading) return <><Navbar /><CardSkeleton /><Footer /></>;
  if (error || !listing) return <><Navbar /><p className="text-red-600 text-center p-8">{error}</p><Footer /></>;

  /* =======================
     Smooth Scroll Handler
======================= */
  const handleCheckAvailability = () => {
    if (user) {
      const bookingEl = document.getElementById("bookingForm");
      bookingEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      signInRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* =======================
     Render
======================= */
  return (
    <main className="bg-neutral-50 min-h-screen">
      <Navbar />

      {/* Public Content */}
      <PropertyDetail
        property={listing} />

      {/* Booking Section */}
      <section aria-labelledby="booking-heading" className="max-w-7xl mx-auto">
        <h2 id="booking-heading" className="sr-only">Booking</h2>

        {authLoading && <CardSkeleton />}

        {!authLoading && !user && (
          <div ref={signInRef} className="text-center" id="bookingForm"> 
            <button
              onClick={() =>
                router.push(`/Login?redirect=${encodeURIComponent(router.asPath)}`)
              }
              className="
                px-6 py-3 sm:px-8 sm:py-4
                bg-emerald-600
                text-white
                rounded-lg
                transition-transform duration-200
                hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-emerald-400
              "
            >
              Sign in to book &rarr;
            </button>
          </div>
        )}

        {!authLoading && user && (
          <div id="bookingForm">
            <BookingForm listingId={listing.id} userId={user.id} />
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
