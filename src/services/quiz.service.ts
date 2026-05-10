import countriesData from "@/data/countries.json";
import type { QuestionDirection, Difficulty } from "@/types/game.types";
import { TIER_1_COUNTRIES, TIER_2_COUNTRIES } from "@/constants/game.constants";

export interface Country {
  name: string;
  capital: string;
  continent: string;
  flag: string;
  code: string;
}

interface RawCountry {
  country_name: string;
  capital: string;
  continent: string;
  country_code: string;
}

function mapCountry(raw: RawCountry): Country {
  return {
    name: raw.country_name,
    capital: raw.capital,
    continent: raw.continent,
    flag: `https://flagcdn.com/w640/${raw.country_code.toLowerCase()}.png`,
    code: raw.country_code,
  };
}

export function getCountries(continent?: string): Country[] {
  const filtered =
    continent && continent !== "todos"
      ? countriesData.filter((c) => c.continent === continent)
      : countriesData;

  return filtered.map(mapCountry);
}

export function getRandomCountry(continent?: string): Country {
  const countries = getCountries(continent);
  return countries[Math.floor(Math.random() * countries.length)];
}

export function getRandomOptions(
  correctCapital: string,
  continent?: string,
  count: number = 4
): string[] {
  const allCountries = getCountries(continent);
  const otherCapitals = allCountries
    .map((c) => c.capital)
    .filter((capital) => capital !== correctCapital);

  const shuffled = otherCapitals.sort(() => Math.random() - 0.5);
  const options = [correctCapital, ...shuffled.slice(0, count - 1)];

  return options.sort(() => Math.random() - 0.5);
}

export function getOptionsForCountry(
  country: Country,
  direction: QuestionDirection,
  continent?: string,
  count: number = 4
): string[] {
  const allCountries = getCountries(continent);

  if (direction === "country-to-capital") {
    const otherCapitals = allCountries
      .map((c) => c.capital)
      .filter((cap) => cap !== country.capital);
    const shuffled = otherCapitals.sort(() => Math.random() - 0.5);
    const options = [country.capital, ...shuffled.slice(0, count - 1)];
    return options.sort(() => Math.random() - 0.5);
  }

  // capital-to-country or flag-to-country → options are country names
  const otherNames = allCountries
    .map((c) => c.name)
    .filter((name) => name !== country.name);
  const shuffled = otherNames.sort(() => Math.random() - 0.5);
  const options = [country.name, ...shuffled.slice(0, count - 1)];
  return options.sort(() => Math.random() - 0.5);
}

export function getCorrectAnswer(
  country: Country,
  direction: QuestionDirection
): string {
  if (direction === "country-to-capital") return country.capital;
  return country.name;
}

export function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string
): boolean {
  const normalized = removeDiacritics(userAnswer.trim().toLowerCase());
  const normalizedCorrect = removeDiacritics(correctAnswer.trim().toLowerCase());
  return normalized === normalizedCorrect;
}

export function getHintFirstLetter(answer: string): string {
  return answer.charAt(0);
}

export function eliminateOptions(
  options: string[],
  correctAnswer: string
): string[] {
  const wrong = options.filter((o) => o !== correctAnswer);
  const keep = wrong.slice(0, 1);
  return [correctAnswer, ...keep].sort(() => Math.random() - 0.5);
}

function getCountryTierByCode(code: string): number {
  if (TIER_1_COUNTRIES.has(code)) return 1;
  if (TIER_2_COUNTRIES.has(code)) return 2;
  return 3;
}

/**
 * Adaptive country selection: picks a random country filtered by
 * allowed tiers, continent, and excluding already-asked countries.
 *
 * Tier progression based on difficulty + streak:
 * - Easy:   start T1 only → after streak 2 add T2 → after streak 4 add T3
 * - Medium: start T1+T2   → after streak 2 add T3
 * - Hard:   all tiers from the start
 */
export function getAdaptiveCountry(
  difficulty: Difficulty,
  streak: number,
  continent?: string,
  excludeNames?: Set<string>
): Country {
  const allCountries = getCountries(continent);

  // Determine which tiers are allowed based on difficulty and current streak
  let maxTier: number;
  if (difficulty === "hard") {
    maxTier = 3;
  } else if (difficulty === "medium") {
    maxTier = streak >= 2 ? 3 : 2;
  } else {
    // easy
    if (streak >= 4) maxTier = 3;
    else if (streak >= 2) maxTier = 2;
    else maxTier = 1;
  }

  let candidates = allCountries.filter((c) => {
    if (excludeNames && excludeNames.has(c.name)) return false;
    return getCountryTierByCode(c.code) <= maxTier;
  });

  // Fallback: if too few candidates, relax tier constraint
  if (candidates.length < 2) {
    candidates = allCountries.filter(
      (c) => !excludeNames || !excludeNames.has(c.name)
    );
  }

  // Final fallback: if all countries exhausted, allow repeats
  if (candidates.length === 0) {
    candidates = allCountries;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
