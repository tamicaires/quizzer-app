import type { GameState, GameAction } from "@/types/game.types";
import { calculatePoints } from "@/services/scoring.service";

export const initialGameState: GameState = {
  screen: "menu",
  config: null,
  currentQuestionIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  incorrectCount: 0,
  livesRemaining: 0,
  feedbackState: "idle",
  showingAnswer: false,
  hintsUsedThisGame: 0,
  currentCountry: null,
  currentOptions: [],
  hintUsed: false,
  questionsAnswered: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialGameState,
        screen: "playing",
        config: action.config,
        livesRemaining: action.config.livesTotal,
        currentCountry: action.country,
        currentOptions: action.options,
      };

    case "ANSWER_CORRECT": {
      const newStreak = state.streak + 1;
      const points = calculatePoints({
        timeRemaining: action.timeRemaining,
        timerSeconds: state.config?.timerSeconds ?? null,
        streak: state.streak,
        hintUsed: state.hintUsed,
      });
      return {
        ...state,
        score: state.score + points,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        correctCount: state.correctCount + 1,
        feedbackState: "correct",
        showingAnswer: false,
        questionsAnswered: state.currentCountry
          ? [...state.questionsAnswered, state.currentCountry]
          : state.questionsAnswered,
      };
    }

    case "ANSWER_INCORRECT": {
      const newLives = state.livesRemaining - 1;
      return {
        ...state,
        streak: 0,
        incorrectCount: state.incorrectCount + 1,
        livesRemaining: newLives,
        feedbackState: "incorrect",
        showingAnswer: true,
        questionsAnswered: state.currentCountry
          ? [...state.questionsAnswered, state.currentCountry]
          : state.questionsAnswered,
      };
    }

    case "TIMER_EXPIRED": {
      const newLives = state.livesRemaining - 1;
      return {
        ...state,
        streak: 0,
        incorrectCount: state.incorrectCount + 1,
        livesRemaining: newLives,
        feedbackState: "incorrect",
        showingAnswer: true,
        questionsAnswered: state.currentCountry
          ? [...state.questionsAnswered, state.currentCountry]
          : state.questionsAnswered,
      };
    }

    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        feedbackState: "idle",
        showingAnswer: false,
        hintUsed: false,
        currentCountry: action.country,
        currentOptions: action.options,
      };

    case "USE_HINT":
      return {
        ...state,
        hintUsed: true,
        hintsUsedThisGame: state.hintsUsedThisGame + 1,
      };

    case "SHOW_RESULTS":
      return {
        ...state,
        screen: "results",
        feedbackState: "idle",
      };

    case "GO_TO_MENU":
      return {
        ...initialGameState,
      };

    case "GO_TO_ACHIEVEMENTS":
      return {
        ...state,
        screen: "achievements",
      };

    case "GO_TO_HIGH_SCORES":
      return {
        ...state,
        screen: "high-scores",
      };

    case "DISMISS_FEEDBACK":
      return {
        ...state,
        feedbackState: "idle",
        showingAnswer: false,
      };

    default:
      return state;
  }
}
