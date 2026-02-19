import { useState, useEffect, useCallback, useRef } from 'react';

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * Hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for debouncing functions
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @param options - Debounce options
 * @returns Debounced function
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options: DebounceOptions = {}
): T {
  const { leading = false, trailing = true, maxWait } = options;
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const maxWaitRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fnRef = useRef(fn);
  const argsRef = useRef<any[] | undefined>(undefined);
  const leadingCallRef = useRef(false);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useCallback(
    (...args: any[]) => {
      argsRef.current = args;

      const later = () => {
        timeoutRef.current = undefined;
        maxWaitRef.current = undefined;
        leadingCallRef.current = false;
        
        if (trailing && argsRef.current) {
          fnRef.current(...argsRef.current);
        }
      };

      const callNow = leading && !leadingCallRef.current;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(later, delay);

      if (callNow) {
        leadingCallRef.current = true;
        fnRef.current(...args);
      }

      // Handle maxWait
      if (maxWait && !maxWaitRef.current) {
        maxWaitRef.current = setTimeout(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
          }
          
          if (argsRef.current) {
            fnRef.current(...argsRef.current);
          }
          
          maxWaitRef.current = undefined;
          leadingCallRef.current = false;
        }, maxWait);
      }
    },
    [delay, leading, trailing, maxWait]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxWaitRef.current) {
        clearTimeout(maxWaitRef.current);
      }
    };
  }, []);

  return debounced as T;
}

/**
 * Hook for debouncing API calls with loading state
 * @param fn - Async function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function and loading state
 */
export function useDebouncedAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): {
  execute: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(false);
  const debouncedFn = useDebounceFn(fn, delay);

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      setIsLoading(true);
      try {
        const result = await debouncedFn(...args);
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedFn]
  );

  return { execute, isLoading };
}

export default useDebounce;