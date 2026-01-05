import { useState, useCallback } from 'react';

/**
 * 管理加载状态的 hook
 * @returns 加载状态和控制函数
 */
export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setIsLoading,
  };
};
