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
   Types — MATCHES PropertyDetail
======================= */
interface ListingDetail {
  id: number;
  name: string;
  location?: string | null;
  price?: number | null;
  description?: string | null;
  media: {
    id: number;
    type: "image" | "video";
    url: string;
  }[];
  reviews?: {
    rating: number;
  }[];
}

export default function TourPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    getListingById(Number(id))
      .then((data) => {
        setListing({
          id: data.id,
          name: data.name,
          location: data.location ?? "Location TBD",
          price: data.price ?? 0,
          description: data.description ?? "No description available.",
          media: (data.resources || []).map((r: any) => ({
            id: r.id,
            type: r.type as "image" | "video",
            url: r.url,
          })),
          reviews: (data as any).reviews || [],
        });
      })
      .catch(() => setError("Failed to load tour details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <>
        <Navbar />
        <CardSkeleton />
        <Footer />
      </>
    );
  if (error || !listing)
    return (
      <>
        <Navbar />
        <p className="text-red-600 text-center p-8">{error}</p>
        <Footer />
      </>
    );

  const handleCheckAvailability = () => {
    if (user) {
      const bookingEl = document.getElementById("bookingForm");
      bookingEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      signInRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="bg-neutral-50 min-h-screen">
      <Navbar />
      <PropertyDetail property={listing} />

      <section aria-labelledby="booking-heading" className="max-w-7xl mx-auto">
        <h2 id="booking-heading" className="sr-only">
          Booking
        </h2>

        {authLoading && <CardSkeleton />}

        {!authLoading && !user && (
          <div ref={signInRef} className="text-center py-12" id="bookingForm">
            <button
              onClick={() =>
                router.push(
                  `/Login?redirect=${encodeURIComponent(router.asPath)}`
                )
              }
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:scale-105 transition">
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
