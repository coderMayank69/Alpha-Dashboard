import { useState, useEffect, useRef } from 'react';

export function usePolling(fetchFn, interval = 30000, enabled = false) {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isPolling, setIsPolling] = useState(enabled);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const timerRef = useRef(null);
  const counterRef = useRef(null);

  const runFetch = async () => {
    await fetchFn();
    setLastUpdated(new Date());
    setSecondsAgo(0);
  };

  useEffect(() => {
    if (!isPolling) {
      clearInterval(timerRef.current);
      clearInterval(counterRef.current);
      return;
    }

    runFetch();
    timerRef.current = setInterval(runFetch, interval);
    counterRef.current = setInterval(() => {
      setSecondsAgo(s => s + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(counterRef.current);
    };
  }, [isPolling, interval]);

  const togglePolling = () => setIsPolling(p => !p);

  return { isPolling, togglePolling, lastUpdated, secondsAgo };
}
