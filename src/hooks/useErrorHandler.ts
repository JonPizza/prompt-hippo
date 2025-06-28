import { useState, useCallback } from 'react';

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void;
  defaultMessage?: string;
}

interface UseErrorHandlerReturn {
  error: string | null;
  isError: boolean;
  setError: (error: string | Error | null) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
  withErrorHandling: <T extends any[], R>(
    fn: (...args: T) => R | Promise<R>
  ) => (...args: T) => Promise<R | undefined>;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<string | null>(null);
  const { onError, defaultMessage = 'An unexpected error occurred' } = options;

  const setError = useCallback((error: string | Error | null) => {
    if (error === null) {
      setErrorState(null);
    } else if (typeof error === 'string') {
      setErrorState(error);
    } else if (error instanceof Error) {
      setErrorState(error.message || defaultMessage);
      if (onError) {
        onError(error);
      }
    }
  }, [onError, defaultMessage]);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error('Error caught by useErrorHandler:', error);
    
    if (error instanceof Error) {
      setError(error);
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError(defaultMessage);
    }
  }, [setError, defaultMessage]);

  const withErrorHandling = useCallback(
    <T extends any[], R>(fn: (...args: T) => R | Promise<R>) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          clearError();
          const result = await fn(...args);
          return result;
        } catch (error) {
          handleError(error);
          return undefined;
        }
      };
    },
    [clearError, handleError]
  );

  return {
    error,
    isError: Boolean(error),
    setError,
    clearError,
    handleError,
    withErrorHandling,
  };
}

// Hook for loading states
interface UseLoadingReturn {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  withLoading: <T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => (...args: T) => Promise<R>;
}

export function useLoading(initialState = false): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(initialState);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const withLoading = useCallback(
    <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
      return async (...args: T): Promise<R> => {
        setLoading(true);
        try {
          const result = await fn(...args);
          return result;
        } finally {
          setLoading(false);
        }
      };
    },
    [setLoading]
  );

  return {
    isLoading,
    setLoading,
    withLoading,
  };
}

// Combined hook for error handling and loading
export function useAsyncState(options: UseErrorHandlerOptions = {}) {
  const errorHandler = useErrorHandler(options);
  const loading = useLoading();

  const execute = useCallback(
    async <T>(asyncFunction: () => Promise<T>): Promise<T | undefined> => {
      loading.setLoading(true);
      try {
        const result = await errorHandler.withErrorHandling(asyncFunction)();
        return result;
      } finally {
        loading.setLoading(false);
      }
    },
    [errorHandler, loading]
  );

  return {
    ...errorHandler,
    ...loading,
    execute,
  };
}
