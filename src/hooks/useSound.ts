import { useCallback, useRef } from "react";
import { useSettings } from "@/context/SettingsContext";

export function useSound() {
  const { soundEnabled } = useSettings();
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType = "sine",
      gain: number = 0.3
    ) => {
      if (!soundEnabled) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gainNode.gain.value = gain;
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration
        );
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Audio not available
      }
    },
    [soundEnabled, getCtx]
  );

  const playCorrect = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.2);
      gainNode.gain.value = 0.3;
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio not available
    }
  }, [soundEnabled, getCtx]);

  const playIncorrect = useCallback(() => {
    playTone(150, 0.3, "sawtooth", 0.2);
  }, [playTone]);

  const playStreak = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      [400, 500, 600].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gainNode.gain.value = 0.2;
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.1 * (i + 1) + 0.15
        );
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.1 * i);
        osc.stop(ctx.currentTime + 0.1 * i + 0.15);
      });
    } catch {
      // Audio not available
    }
  }, [soundEnabled, getCtx]);

  return { playCorrect, playIncorrect, playStreak };
}
