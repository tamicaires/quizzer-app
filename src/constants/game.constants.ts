import type { Difficulty, GameConfig } from "@/types/game.types";

export const DIFFICULTY_CONFIGS: Record<
  Difficulty,
  Pick<GameConfig, "mode" | "timerSeconds" | "livesTotal">
> = {
  easy: {
    mode: "multiple-choice",
    timerSeconds: null,
    livesTotal: 5,
  },
  medium: {
    mode: "typing",
    timerSeconds: null,
    livesTotal: 3,
  },
  hard: {
    mode: "typing",
    timerSeconds: 12,
    livesTotal: 3,
  },
};

export const SCORING = {
  BASE_POINTS: 100,
  MAX_TIME_BONUS: 50,
  MAX_STREAK_MULTIPLIER: 5,
  HINT_PENALTY_FACTOR: 0.5,
};

export const TIMER = {
  TICK_INTERVAL_MS: 100,
};

export const MULTIPLE_CHOICE_OPTIONS_COUNT = 4;

export const DEFAULT_QUESTION_COUNT = 10;
export const MIN_QUESTION_COUNT = 5;
export const MAX_QUESTION_COUNT = 50;

export const DAILY_CHALLENGE_QUESTION_COUNT = 10;

export const FEEDBACK_DISPLAY_MS = 1500;

export const CONTINENTS = [
  "todos",
  "América do Sul",
  "Europa",
  "Ásia",
  "África",
  "América do Norte",
  "Oceania",
] as const;

/**
 * Country tiers by country_code for adaptive difficulty.
 * Tier 1: Very well-known countries most people can identify.
 * Tier 2: Moderately known countries.
 * Tier 3: Everything not in tier 1 or 2 (obscure/small nations).
 */
export const TIER_1_COUNTRIES = new Set([
  "BR", "US", "MX", "AR", "CA", "CO", "CL", "PE",
  "FR", "DE", "GB", "IT", "ES", "PT", "RU", "GR", "NL", "CH", "SE", "NO",
  "JP", "CN", "IN", "KR", "TR", "AU",
  "EG", "ZA",
]);

export const TIER_2_COUNTRIES = new Set([
  "VE", "UY", "EC", "BO", "PY",
  "CU", "JM", "HT",
  "AT", "BE", "DK", "FI", "IE", "PL", "CZ", "HU", "RO", "HR", "UA", "BG",
  "RS", "SK", "IS", "BA", "LT", "LV", "EE", "SI", "AL", "ME", "BY",
  "TH", "VN", "ID", "MY", "PK", "BD", "IR", "IQ", "IL", "SA", "AE",
  "PH", "KH", "SG", "QA", "KW", "JO", "LB", "SY", "AF", "NP",
  "NZ",
  "NG", "KE", "ET", "MA", "DZ", "AO", "GH", "TN", "TZ", "LY",
]);
