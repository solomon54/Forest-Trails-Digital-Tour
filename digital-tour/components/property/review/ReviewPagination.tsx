// components/property/review/ReviewPagination.tsx
interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ReviewPagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  // helper to generate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      // show all if <=7 pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // first page
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages); // last page
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-7 px-3 rounded-full bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Pages */}
      {getVisiblePages().map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={`page-${page}-${idx}`}
            onClick={() => onPageChange(page)}
            className={`h-7 w-7 rounded-full text-sm font-semibold transition ${
              page === currentPage
                ? "bg-emerald-600 text-white scale-105 shadow-md"
                : "bg-white text-gray-700 shadow-sm hover:shadow-md"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            …
          </span>
        )
      )}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-7 px-3 rounded-full bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
