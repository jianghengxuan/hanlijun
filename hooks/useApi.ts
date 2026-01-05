import { useState, useCallback } from 'react';

interface UseApiResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

/**
 * 处理 API 调用的 hook
 * @returns API 调用状态和执行函数
 */
export const useApi = <T>(): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      console.error('API call failed:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};
