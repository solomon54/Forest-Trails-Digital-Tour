interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ReviewPagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  // Generate visible pages intelligently
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 mt-4" aria-label="Pagination">
      {/* Prev Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8 px-3 rounded-full bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={`page-${page}-${idx}`}
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 rounded-full text-sm font-semibold transition flex items-center justify-center ${
              page === currentPage
                ? "bg-emerald-600 text-white scale-105 shadow-md"
                : "bg-white text-gray-700 shadow-sm hover:shadow-md"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        )
      )}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 px-3 rounded-full bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
