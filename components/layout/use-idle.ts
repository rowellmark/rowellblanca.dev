'use client';

import { useEffect, useState } from 'react';

/** True once the browser is idle after load (or after `timeout` ms at the latest). */
export function useIdle(timeout = 2500) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(id);
  }, [timeout]);
  return idle;
}
