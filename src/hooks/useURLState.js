import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useURLState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key, defaultVal = '') => {
    return searchParams.get(key) ?? defaultVal;
  }, [searchParams]);

  const getArrayParam = useCallback((key) => {
    const val = searchParams.get(key);
    if (!val) return [];
    return val.split(',').filter(Boolean);
  }, [searchParams]);

  const getNumberParam = useCallback((key, defaultVal = 1) => {
    const val = searchParams.get(key);
    const num = parseInt(val, 10);
    return isNaN(num) ? defaultVal : num;
  }, [searchParams]);

  const setParam = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        next.delete(key);
      } else {
        next.set(key, Array.isArray(value) ? value.join(',') : String(value));
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setParams = useCallback((updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
          next.delete(key);
        } else {
          next.set(key, Array.isArray(value) ? value.join(',') : String(value));
        }
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const clearParams = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { getParam, getArrayParam, getNumberParam, setParam, setParams, clearParams };
}
