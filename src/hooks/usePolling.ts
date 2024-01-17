import { useCallback, useEffect, useRef, useState } from 'react';

const usePolling = <R = unknown>(fn: () => Promise<R>, interval: number) => {
  const runningCount = useRef(0);
  const timeout = useRef<number>();
  const mountedRef = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);

  const next = useCallback(
    (handler: TimerHandler) => {
      if (mountedRef.current && runningCount.current === 0) {
        timeout.current = window.setTimeout(handler, interval);
      }
    },
    [interval],
  );

  const run = useCallback(async () => {
    runningCount.current += 1;
    const result = await fn();
    setLoading(false);
    runningCount.current -= 1;
    next(run);

    return result;
  }, [fn, next]);

  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
    mountedRef.current = true;
    setLoading(true);
    run();
    return () => {
      mountedRef.current = false;
      window.clearTimeout(timeout.current);
    };
  }, [run]);

  const cancel = () => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
  };

  const flush = useCallback(() => {
    cancel();
    return run();
  }, [run]);

  return { flush, loading, cancel };
};

export default usePolling;
