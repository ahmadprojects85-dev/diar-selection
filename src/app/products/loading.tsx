export default function Loading() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-bg-card rounded mb-4"></div>
        <div className="h-4 w-96 bg-bg-card rounded"></div>
      </div>
      
      {/* Filters Skeleton */}
      <div className="flex gap-4 mb-8 overflow-hidden">
        <div className="h-10 w-24 bg-bg-card rounded-full"></div>
        <div className="h-10 w-24 bg-bg-card rounded-full"></div>
        <div className="h-10 w-24 bg-bg-card rounded-full"></div>
        <div className="h-10 w-24 bg-bg-card rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-bg-elevated rounded-2xl p-4 space-y-4">
            <div className="w-full aspect-[4/5] bg-bg-card rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-3 w-1/3 bg-bg-card rounded"></div>
              <div className="h-5 w-3/4 bg-bg-card rounded"></div>
            </div>
            <div className="h-5 w-1/4 bg-bg-card rounded"></div>
            <div className="h-10 w-full bg-bg-card rounded-lg mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
