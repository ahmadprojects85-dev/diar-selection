export default function Loading() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Image Skeleton */}
        <div className="space-y-4">
          <div className="w-full h-[500px] md:h-[600px] bg-bg-card rounded-2xl"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="w-full h-24 bg-bg-card rounded-xl"></div>
            <div className="w-full h-24 bg-bg-card rounded-xl"></div>
            <div className="w-full h-24 bg-bg-card rounded-xl"></div>
            <div className="w-full h-24 bg-bg-card rounded-xl"></div>
          </div>
        </div>

        {/* Right: Content Skeleton */}
        <div className="space-y-8 py-4">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-bg-card rounded"></div>
            <div className="h-10 w-3/4 bg-bg-card rounded"></div>
            <div className="h-8 w-1/4 bg-bg-card rounded mt-4"></div>
          </div>
          
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="h-4 w-full bg-bg-card rounded"></div>
            <div className="h-4 w-full bg-bg-card rounded"></div>
            <div className="h-4 w-5/6 bg-bg-card rounded"></div>
          </div>

          <div className="pt-6 border-t border-border space-y-4">
            <div className="h-12 w-full bg-bg-card rounded-lg"></div>
            <div className="h-12 w-full bg-bg-card rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
