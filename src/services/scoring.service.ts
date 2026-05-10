import { SCORING } from "@/constants/game.constants";

interface ScoreParams {
  timeRemaining: number | null;
  timerSeconds: number | null;
  streak: number;
  hintUsed: boolean;
}

export function calculatePoints(params: ScoreParams): number {
  const { timeRemaining, timerSeconds, streak, hintUsed } = params;

  let timeBonus = 0;
  if (timeRemaining !== null && timerSeconds !== null && timerSeconds > 0) {
    timeBonus = Math.round(
      (timeRemaining / timerSeconds) * SCORING.MAX_TIME_BONUS
    );
  }

  const streakMultiplier = Math.min(streak + 1, SCORING.MAX_STREAK_MULTIPLIER);
  const hintFactor = hintUsed ? SCORING.HINT_PENALTY_FACTOR : 1;

  return Math.round(
    (SCORING.BASE_POINTS + timeBonus) * streakMultiplier * hintFactor
  );
}
