import { LoadingState } from "@/components/common/loading-states";

export default function Loading() {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-base-300 rounded mb-2 w-32 animate-pulse"></div>
        <div className="h-8 bg-base-300 rounded mb-4 w-64 animate-pulse"></div>
      </div>
      
      {/* Main loading state */}
      <LoadingState 
        message="Loading your project..." 
        size="lg"
      />
      
      {/* Additional skeleton content */}
      <div className="mt-8 space-y-4">
        <div className="h-12 bg-base-300 rounded animate-pulse"></div>
        <div className="h-20 bg-base-300 rounded animate-pulse"></div>
        <div className="h-16 bg-base-300 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
