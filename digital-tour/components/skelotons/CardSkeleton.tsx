// components/skelotons/CardSkeleton.tsx
const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
      {/* Header placeholder */}
      <div className="h-6 w-3/4 bg-slate-300 rounded mb-3"></div>
      <div className="h-4 w-1/4 bg-slate-300 rounded mb-2"></div>

      {/* Details placeholders */}
      <div className="h-4 w-1/2 bg-slate-300 rounded mb-1"></div>
      <div className="h-4 w-2/3 bg-slate-300 rounded mb-1"></div>
      <div className="h-5 w-1/3 bg-slate-300 rounded mt-2"></div>

      {/* Button placeholder */}
      <div className="mt-4 h-10 w-full bg-slate-300 rounded-xl"></div>
    </div>
  );
};

export default CardSkeleton;
