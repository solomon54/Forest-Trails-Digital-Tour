// components/common/ActivityPagination.tsx
interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  loading?: boolean;
}

export function ActivityPagination({
  page,
  totalPages,
  onChange,
  loading = false,
}: Props) {
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-2 flex-wrap"
      aria-label="Pagination"
    >
      {/* Previous */}
<button
  type="button"
  onClick={() => onChange(page - 1)}
  disabled={page === 1 || loading}
  className="h-9 px-4 sm:px-5 rounded-full bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-800 transition shadow-sm"
>
  Prev
</button>

{/* Page Numbers */}
{visiblePages.map((p, idx) =>
  typeof p === "number" ? (
    <button
      key={p}
      type="button"  // <-- ADD THIS
      onClick={() => onChange(p)}
      disabled={loading}
      className={`
        h-9 w-9 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center justify-center
        ${p === page
          ? "bg-emerald-600 text-white scale-110 shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"}
      `}
    >
      {p}
    </button>
  ) : (
    <span
      key={`ellipsis-${idx}`}
      className="px-2 text-gray-500 font-medium text-sm"
    >
      …
    </span>
  )
)}

{/* Next */}
<button
  type="button" // <-- ADD THIS
  onClick={() => onChange(page + 1)}
  disabled={page === totalPages || loading}
  className="h-9 px-4 sm:px-5 rounded-full bg-emerald-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-800 transition shadow-sm"
>
  Next
</button>
    </nav>
  );
}
