import React, { createContext, useContext, useReducer, useCallback } from "react";
import { gameReducer, initialGameState } from "@/reducers/gameReducer";
import type { GameState, GameAction, GameConfig } from "@/types/game.types";
import {
  getAdaptiveCountry,
  getOptionsForCountry,
  type Country,
} from "@/services/quiz.service";
import { getDailyChallengeCountries } from "@/services/daily-challenge.service";

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (config: GameConfig) => void;
  nextQuestion: () => void;
  dailyCountries: Country[] | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const dailyCountriesRef = React.useRef<Country[] | null>(null);

  const startGame = useCallback((config: GameConfig) => {
    let firstCountry: Country;
    let countries: Country[] | null = null;

    if (config.isDailyChallenge) {
      countries = getDailyChallengeCountries();
      dailyCountriesRef.current = countries;
      firstCountry = countries[0];
    } else {
      dailyCountriesRef.current = null;
      const continent = config.continent === "todos" ? undefined : config.continent;
      // First question always starts with an easy country (streak = 0)
      firstCountry = getAdaptiveCountry(config.difficulty, 0, continent);
    }

    const options =
      config.mode === "multiple-choice"
        ? getOptionsForCountry(
            firstCountry,
            config.direction,
            config.continent === "todos" ? undefined : config.continent
          )
        : [];

    dispatch({ type: "START_GAME", config, country: firstCountry, options });
  }, []);

  const nextQuestion = useCallback(() => {
    if (!state.config) return;

    const nextIndex = state.currentQuestionIndex + 1;
    let nextCountry: Country;

    if (
      state.config.isDailyChallenge &&
      dailyCountriesRef.current &&
      nextIndex < dailyCountriesRef.current.length
    ) {
      nextCountry = dailyCountriesRef.current[nextIndex];
    } else {
      const continent =
        state.config.continent === "todos"
          ? undefined
          : state.config.continent;

      // Build exclusion set from already-asked countries
      const excludeNames = new Set(
        state.questionsAnswered.map((c) => c.name)
      );
      if (state.currentCountry) {
        excludeNames.add(state.currentCountry.name);
      }

      nextCountry = getAdaptiveCountry(
        state.config.difficulty,
        state.streak,
        continent,
        excludeNames
      );
    }

    const options =
      state.config.mode === "multiple-choice"
        ? getOptionsForCountry(
            nextCountry,
            state.config.direction,
            state.config.continent === "todos"
              ? undefined
              : state.config.continent
          )
        : [];

    dispatch({ type: "NEXT_QUESTION", country: nextCountry, options });
  }, [state.config, state.currentQuestionIndex, state.streak, state.questionsAnswered, state.currentCountry]);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        startGame,
        nextQuestion,
        dailyCountries: dailyCountriesRef.current,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
