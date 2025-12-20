// components/property/review/ReviewSection.tsx
import { useCallback, useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import ReviewPagination from "./ReviewPagination";
import ReviewForm from "./ReviewForm";
import ReviewSkeleton from "@/components/skelotons/ReviewSkeleton";

interface ReviewSectionProps {
  listingId: number;
}

interface Review {
  id: number;
  rating: number;
  comment?: string;
  created_at?: string;
  reviewUser?: {
    name?: string;
    photo_url?: string;
  };
}

interface ReviewMeta {
  page: number;
  totalPages: number;
  totalItems?: number;
}

export default function ReviewSection({ listingId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ReviewMeta | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(
    async (pageNumber = 1) => {
      if (!listingId) return;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/reviews?listingId=${listingId}&page=${pageNumber}&limit=5`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await res.json();
        setReviews(data.data ?? []);
        setMeta(data.meta ?? null);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    },
    [listingId]
  );

  useEffect(() => {
    fetchReviews(page);
  }, [fetchReviews, page]);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Guest Reviews</h2>

      {/* ⭐ Auth-aware Review Form */}
      <ReviewForm
        listingId={listingId}
        onSuccess={() => fetchReviews(page)}
      />

      {loading && (
        <p className="text-gray-500">Loading reviews...</p>
      )}

      {!loading && reviews.length === 0 && (
        <p className="italic text-gray-500">
          No reviews yet. Be the first!
        </p>
      )}

     {loading ? (
  <ReviewSkeleton count={5} />
) : reviews.length === 0 ? (
  <p className="italic text-gray-500">No reviews yet. Be the first!</p>
) : (
  <ReviewList reviews={reviews} />
)}

      {meta && meta.totalPages > 1 && (
        <ReviewPagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
