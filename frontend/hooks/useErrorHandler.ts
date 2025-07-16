import { useCallback } from 'react';

export interface ErrorHandlerOptions {
  logError?: boolean;
  fallbackValue?: any;
  onError?: (error: Error) => void;
}

export function useErrorHandler() {
  const handleError = useCallback((error: unknown, options: ErrorHandlerOptions = {}) => {
    const { logError = true, fallbackValue = null, onError } = options;
    
    const errorInstance = error instanceof Error ? error : new Error(String(error));
    
    if (logError) {
      console.error('Error caught by handler:', errorInstance);
    }
    
    if (onError) {
      onError(errorInstance);
    }
    
    return fallbackValue;
  }, []);

  const safeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: ErrorHandlerOptions & { fallbackValue: T }
  ): Promise<T> => {
    try {
      return await asyncFn();
    } catch (error) {
      return handleError(error, options);
    }
  }, [handleError]);

  const safeSync = useCallback(<T>(
    syncFn: () => T,
    options: ErrorHandlerOptions & { fallbackValue: T }
  ): T => {
    try {
      return syncFn();
    } catch (error) {
      return handleError(error, options);
    }
  }, [handleError]);

  return {
    handleError,
    safeAsync,
    safeSync,
  };
}