import { useState, useEffect, useCallback } from 'react';

/**
 * 处理本地存储的 hook
 * @param key 存储键名
 * @param initialValue 初始值
 * @returns 存储值和更新函数
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  // 从本地存储获取初始值
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // 状态管理
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 更新本地存储
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried setting localStorage key "${key}" on the server`);
      return;
    }

    try {
      // 允许函数式更新
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 更新状态
      setStoredValue(valueToStore);
      
      // 更新本地存储
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 监听其他窗口对同一键的更改
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};
