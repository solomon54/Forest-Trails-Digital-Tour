// components/skeletons/ReviewSkeleton.tsx
export default function ReviewSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex gap-4 animate-pulse">
          {/* User avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-300" />

          {/* Review content */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded" />
            <div className="h-3 w-2/3 bg-gray-300 rounded" />
            <div className="h-3 w-1/2 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
