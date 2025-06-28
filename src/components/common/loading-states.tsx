import CenteredSpinner from "./centered-spinner";

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showMessage?: boolean;
  className?: string;
}

export function LoadingState({ 
  size = 'md', 
  message = 'Loading...', 
  showMessage = true,
  className = '' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  return (
    <div className={`text-center ${sizeClasses[size]} ${className}`}>
      <CenteredSpinner />
      {showMessage && (
        <p className="mt-4 text-sm opacity-70">{message}</p>
      )}
    </div>
  );
}

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export function Skeleton({ lines = 3, className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-base-300 rounded mb-2 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export function CardSkeleton({ count = 3, className = '' }: CardSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card border animate-pulse">
          <div className="card-body">
            <div className="h-6 bg-base-300 rounded mb-2"></div>
            <div className="h-4 bg-base-300 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/2"></div>
            <div className="card-actions justify-end mt-4">
              <div className="h-8 w-20 bg-base-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingState;
