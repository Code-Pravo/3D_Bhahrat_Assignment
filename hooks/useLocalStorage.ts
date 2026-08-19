import { useCallback, useState } from "react";

/**
 * Persists a value to localStorage, keeping it in sync across state changes.
 * Falls back silently when storage is unavailable (e.g. SSR / private mode).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue] as const;
}
