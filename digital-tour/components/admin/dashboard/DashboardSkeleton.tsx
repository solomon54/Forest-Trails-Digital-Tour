// components/admin/dashboard/DashboardSkeleton.tsx
export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
      <div>
        <div className="h-12 w-96 bg-gray-200 rounded-2xl mb-4" />
        <div className="h-6 w-64 bg-gray-200 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between">
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                <div className="h-12 w-24 bg-gray-200 rounded" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}