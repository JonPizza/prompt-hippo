interface ErrorDisplayProps {
  error?: string | Error | null;
  title?: string;
  showDetails?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'alert' | 'modal' | 'inline';
  size?: 'sm' | 'md' | 'lg';
}

export function ErrorDisplay({
  error,
  title = 'Something went wrong',
  showDetails = false,
  onRetry,
  onDismiss,
  variant = 'alert',
  size = 'md'
}: ErrorDisplayProps) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';
  const errorStack = error instanceof Error ? error.stack : undefined;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  const baseContent = (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1">
        <h3 className="font-bold">{title}</h3>
        <div className="text-sm mt-1">{errorMessage}</div>
        {showDetails && errorStack && process.env.NODE_ENV === 'development' && (
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-1 text-left whitespace-pre-wrap overflow-auto max-h-32">
              {errorStack}
            </pre>
          </details>
        )}
      </div>
    </>
  );

  const actionButtons = (onRetry || onDismiss) && (
    <div className="flex gap-2 mt-3">
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-sm">
          Try Again
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="btn btn-ghost btn-sm">
          Dismiss
        </button>
      )}
    </div>
  );

  switch (variant) {
    case 'modal':
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-base-100 p-6 rounded-lg ${sizeClasses[size]} mx-4`}>
            <div className="flex items-start gap-3">
              {baseContent}
            </div>
            {actionButtons}
          </div>
        </div>
      );

    case 'inline':
      return (
        <div className="text-error p-2 text-sm">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
          {actionButtons}
        </div>
      );

    case 'alert':
    default:
      return (
        <div className="text-center p-8">
          <div className={`alert alert-error ${sizeClasses[size]} mx-auto`}>
            {baseContent}
          </div>
          {actionButtons}
        </div>
      );
  }
}

export default ErrorDisplay;
