import { dateSeed, mulberry32, seededShuffle } from "@/lib/seededRandom";
import { getCountries, type Country } from "@/services/quiz.service";
import { loadFromStorage, saveToStorage } from "@/services/storage.service";
import type { DailyChallengeResult } from "@/types/game.types";
import { DAILY_CHALLENGE_QUESTION_COUNT } from "@/constants/game.constants";

const STORAGE_KEY = "daily_challenge";

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyChallengeCountries(): Country[] {
  const seed = dateSeed();
  const rng = mulberry32(seed);
  const all = getCountries();
  const shuffled = seededShuffle(all, rng);
  return shuffled.slice(0, DAILY_CHALLENGE_QUESTION_COUNT);
}

export function hasDailyChallengeBeenPlayed(): boolean {
  const result = loadFromStorage<DailyChallengeResult | null>(
    STORAGE_KEY,
    null
  );
  if (!result) return false;
  return result.date === todayString() && result.completed;
}

export function saveDailyChallengeResult(
  score: number,
  correctCount: number,
  totalQuestions: number
): void {
  const result: DailyChallengeResult = {
    date: todayString(),
    score,
    correctCount,
    totalQuestions,
    completed: true,
  };
  saveToStorage(STORAGE_KEY, result);
}

export function getDailyChallengeResult(): DailyChallengeResult | null {
  const result = loadFromStorage<DailyChallengeResult | null>(
    STORAGE_KEY,
    null
  );
  if (!result || result.date !== todayString()) return null;
  return result;
}
