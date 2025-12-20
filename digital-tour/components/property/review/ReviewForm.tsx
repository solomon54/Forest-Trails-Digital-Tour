// components/property/review/ReviewForm.tsx
import { useState, useCallback } from "react";
import StarRatingInput from "./StarRatingInput";

interface ReviewFormProps {
  listingId: number;
  onSuccess: () => void;
}

export default function ReviewForm({ listingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const submitReview = useCallback(async () => {
    const trimmedComment = comment.trim();

    // Basic validation
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    if (!trimmedComment) {
      setError("Please write a comment about your experience.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ listing_id: listingId, rating, comment: trimmedComment }),
      });

      if (res.status === 401) {
        setError("You must be logged in to submit a review.");
      } else if (res.status === 409) {
        // Already submitted
        setReviewSubmitted(true);
      } else if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to submit review.");
      } else {
        // Success
        setRating(0);
        setComment("");
        setReviewSubmitted(true);
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [comment, listingId, onSuccess, rating]);

  if (reviewSubmitted) {
    return (
      <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-gray-700">
        <p className="text-lg font-medium">
          You’ve already submitted a review for this listing. Thank you!
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm" aria-busy={loading}>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Leave a Review</h3>

      <div className="mb-4">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <div className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell others what you liked (or didn’t)..."
          rows={4}
          className={`w-full resize-none rounded-xl bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-700/30 transition ${error && !comment.trim() ? "ring-2 ring-red-400" : ""}`}
        />
      </div>

      {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

      <button
        onClick={submitReview}
        disabled={loading}
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
