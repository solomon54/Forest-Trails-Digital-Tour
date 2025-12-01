// pages/tours/[id].tsx
import { useRouter } from "next/router";
import PropertyDetail from "@/components/property/PropertyDetail";
import BookingSection from "@/components/property/BookingSection";
import ReviewSection from "@/components/property/ReviewSection";
import CardSkeleton from "@/components/skelotons/CardSkeleton";
import { useEffect, useState } from "react";

interface Tour {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
  description?: string;
}

export default function TourPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Simulate API call for demo
    setLoading(true);
    setTimeout(() => {
      setTour({
        id: Number(id),
        name: "Simien Mountains Trek",
        location: "Gondar",
        price: 180,
        image: "/images/tour3.jpg",
        description:
          "Experience the breathtaking Simien Mountains in a 3-day adventure tour.",
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) return <CardSkeleton />;

  if (!tour) return <div className="text-center p-8">Tour not found</div>;

  return (
    <div className="bg-neutral-50 text-slate-900 font-inter">
      <PropertyDetail property={tour} />
      <BookingSection tour={tour} />
      <ReviewSection tourId={tour.id} />
    </div>
  );
}












// import { useRouter } from "next/router";
// import PropertyDetail from "@/components/property/PropertyDetail";
// import BookingSection from "@/components/property/BookingSection";
// import ReviewSection from "@/components/property/ReviewSection";

// export default function TourPage() {
//   const router = useRouter();
//   const { id } = router.query;

//   // TODO: fetch tour data by id
//   const tour = /* fetch from API or placeholder */;

//   if (!tour) return <div>Loading...</div>;

//   return (
//     <div className="p-4 md:p-16">
//       <PropertyDetail property={tour} />
//       <BookingSection tour={tour} />
//       <ReviewSection tourId={tour.id} />
//     </div>
//   );
// }
