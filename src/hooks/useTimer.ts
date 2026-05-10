import { useState, useEffect, useCallback, useRef } from "react";
import { TIMER } from "@/constants/game.constants";

interface UseTimerOptions {
  totalSeconds: number | null;
  onExpire: () => void;
  running: boolean;
}

export function useTimer({ totalSeconds, onExpire, running }: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    totalSeconds
  );
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const reset = useCallback(() => {
    setTimeRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    setTimeRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || totalSeconds === null || timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        const next = Math.max(0, prev - TIMER.TICK_INTERVAL_MS / 1000);
        if (next <= 0) {
          clearInterval(interval);
          setTimeout(() => onExpireRef.current(), 0);
          return 0;
        }
        return next;
      });
    }, TIMER.TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [running, totalSeconds, timeRemaining === null]);

  const fraction =
    totalSeconds !== null && timeRemaining !== null
      ? timeRemaining / totalSeconds
      : null;

  return { timeRemaining, fraction, reset };
}
