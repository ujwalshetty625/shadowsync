import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that polls a URL at a given interval.
 * Returns { data, loading, error }.
 */
export function usePolling(url, intervalMs = 2000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    timerRef.current = setInterval(fetchData, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, [url, intervalMs]);

  return { data, loading, error };
}
