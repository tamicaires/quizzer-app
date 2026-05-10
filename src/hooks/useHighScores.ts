import { useState, useCallback } from "react";
import { loadFromStorage, saveToStorage } from "@/services/storage.service";
import type { HighScoreEntry } from "@/types/game.types";

const STORAGE_KEY = "high_scores";
const MAX_ENTRIES = 10;

export function useHighScores() {
  const [scores, setScores] = useState<HighScoreEntry[]>(() =>
    loadFromStorage(STORAGE_KEY, [])
  );

  const addScore = useCallback(
    (entry: HighScoreEntry): boolean => {
      const updated = [...scores, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES);

      setScores(updated);
      saveToStorage(STORAGE_KEY, updated);

      // Return true if this entry made it into the list
      return updated.some(
        (s) => s.score === entry.score && s.date === entry.date
      );
    },
    [scores]
  );

  const isNewHighScore = useCallback(
    (score: number): boolean => {
      if (scores.length < MAX_ENTRIES) return true;
      return score > scores[scores.length - 1].score;
    },
    [scores]
  );

  return { scores, addScore, isNewHighScore };
}
