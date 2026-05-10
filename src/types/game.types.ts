import type { Country } from "@/services/quiz.service";

export type GameMode = "typing" | "multiple-choice";
export type QuestionDirection =
  | "country-to-capital"
  | "capital-to-country"
  | "flag-to-country";
export type Difficulty = "easy" | "medium" | "hard";
export type Screen =
  | "menu"
  | "playing"
  | "results"
  | "game-over"
  | "achievements"
  | "high-scores";
export type FeedbackState = "idle" | "correct" | "incorrect";

export interface GameConfig {
  mode: GameMode;
  direction: QuestionDirection;
  difficulty: Difficulty;
  continent: string;
  questionCount: number;
  timerSeconds: number | null;
  livesTotal: number;
  isDailyChallenge: boolean;
}

export interface GameState {
  screen: Screen;
  config: GameConfig | null;
  currentQuestionIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  incorrectCount: number;
  livesRemaining: number;
  feedbackState: FeedbackState;
  showingAnswer: boolean;
  hintsUsedThisGame: number;
  currentCountry: Country | null;
  currentOptions: string[];
  hintUsed: boolean;
  questionsAnswered: Country[];
}

export type GameAction =
  | { type: "START_GAME"; config: GameConfig; country: Country; options: string[] }
  | { type: "ANSWER_CORRECT"; timeRemaining: number | null }
  | { type: "ANSWER_INCORRECT" }
  | { type: "NEXT_QUESTION"; country: Country; options: string[] }
  | { type: "USE_HINT" }
  | { type: "TIMER_EXPIRED" }
  | { type: "SHOW_RESULTS" }
  | { type: "GO_TO_MENU" }
  | { type: "GO_TO_ACHIEVEMENTS" }
  | { type: "GO_TO_HIGH_SCORES" }
  | { type: "DISMISS_FEEDBACK" };

export interface HighScoreEntry {
  score: number;
  correctCount: number;
  totalQuestions: number;
  difficulty: Difficulty;
  mode: GameMode;
  continent: string;
  date: string;
  maxStreak: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AccumulatedStats {
  totalGamesPlayed: number;
  totalCorrect: number;
  totalIncorrect: number;
  bestStreak: number;
  gamesWithoutHints: number;
  continentsPlayed: string[];
  dailyChallengesCompleted: number;
  bestScore: number;
}

export interface DailyChallengeResult {
  date: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completed: boolean;
}
