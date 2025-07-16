import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

export interface AsyncOperationOptions<T> {
  initialValue?: T;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  logError?: boolean;
}

export function useAsyncOperation<T>(options: AsyncOperationOptions<T> = {}) {
  const { initialValue, onSuccess, onError, logError = true } = options;
  const [data, setData] = useState<T | undefined>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      handleError(error, { logError, onError });
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, onSuccess, onError, logError]);

  const reset = useCallback(() => {
    setData(initialValue);
    setError(null);
    setIsLoading(false);
  }, [initialValue]);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}