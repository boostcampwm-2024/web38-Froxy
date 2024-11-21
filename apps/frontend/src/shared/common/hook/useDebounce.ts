import { useCallback, useRef } from 'react';

export const useDebounce = (fn: () => void, delay: number) => {
  const timeoutRef = useRef<number | null>(null);

  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => fn(), delay);
  }, [fn, delay]);
};
