import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { loadFromStorage, saveToStorage } from "@/services/storage.service";
import { ACHIEVEMENTS } from "@/constants/achievements.constants";
import type { AccumulatedStats, AchievementDef } from "@/types/game.types";

const EMPTY_STATS: AccumulatedStats = {
  totalGamesPlayed: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  bestStreak: 0,
  gamesWithoutHints: 0,
  continentsPlayed: [],
  dailyChallengesCompleted: 0,
  bestScore: 0,
};

interface AchievementsContextType {
  unlockedIds: string[];
  stats: AccumulatedStats;
  recentUnlock: AchievementDef | null;
  dismissToast: () => void;
  checkAndUnlock: (stats: AccumulatedStats) => void;
  updateStats: (update: Partial<AccumulatedStats> & {
    addCorrect?: number;
    addIncorrect?: number;
    addGame?: boolean;
    addDailyChallenge?: boolean;
    addContinent?: string;
    noHints?: boolean;
    streak?: number;
    score?: number;
    perfectGame?: boolean;
  }) => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(
  undefined
);

const ALL_CONTINENTS = [
  "América do Sul",
  "Europa",
  "Ásia",
  "África",
  "América do Norte",
  "Oceania",
];

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() =>
    loadFromStorage("achievements_unlocked", [])
  );
  const [stats, setStats] = useState<AccumulatedStats>(() =>
    loadFromStorage("accumulated_stats", EMPTY_STATS)
  );
  const [recentUnlock, setRecentUnlock] = useState<AchievementDef | null>(null);
  const toastQueue = useRef<AchievementDef[]>([]);

  const showNextToast = useCallback(() => {
    if (toastQueue.current.length > 0) {
      const next = toastQueue.current.shift()!;
      setRecentUnlock(next);
    }
  }, []);

  const dismissToast = useCallback(() => {
    setRecentUnlock(null);
    setTimeout(showNextToast, 300);
  }, [showNextToast]);

  const checkAndUnlock = useCallback(
    (currentStats: AccumulatedStats) => {
      const newUnlocks: AchievementDef[] = [];

      const check = (id: string, condition: boolean) => {
        if (condition && !unlockedIds.includes(id)) {
          const def = ACHIEVEMENTS.find((a) => a.id === id);
          if (def) newUnlocks.push(def);
        }
      };

      check("first_game", currentStats.totalGamesPlayed >= 1);
      check("streak_5", currentStats.bestStreak >= 5);
      check("streak_10", currentStats.bestStreak >= 10);
      check(
        "all_continents",
        ALL_CONTINENTS.every((c) =>
          currentStats.continentsPlayed.includes(c)
        )
      );
      check("daily_7", currentStats.dailyChallengesCompleted >= 7);
      check("no_hints_10", currentStats.gamesWithoutHints >= 10);
      check("score_1000", currentStats.bestScore >= 1000);
      check("correct_100", currentStats.totalCorrect >= 100);
      check("correct_500", currentStats.totalCorrect >= 500);

      if (newUnlocks.length > 0) {
        const newIds = [...unlockedIds, ...newUnlocks.map((a) => a.id)];
        setUnlockedIds(newIds);
        saveToStorage("achievements_unlocked", newIds);

        toastQueue.current.push(...newUnlocks);
        if (!recentUnlock) showNextToast();
      }
    },
    [unlockedIds, recentUnlock, showNextToast]
  );

  const updateStats = useCallback(
    (update: {
      addCorrect?: number;
      addIncorrect?: number;
      addGame?: boolean;
      addDailyChallenge?: boolean;
      addContinent?: string;
      noHints?: boolean;
      streak?: number;
      score?: number;
      perfectGame?: boolean;
    }) => {
      setStats((prev) => {
        const next: AccumulatedStats = { ...prev };

        if (update.addCorrect)
          next.totalCorrect = prev.totalCorrect + update.addCorrect;
        if (update.addIncorrect)
          next.totalIncorrect = prev.totalIncorrect + update.addIncorrect;
        if (update.addGame)
          next.totalGamesPlayed = prev.totalGamesPlayed + 1;
        if (update.addDailyChallenge)
          next.dailyChallengesCompleted =
            prev.dailyChallengesCompleted + 1;
        if (update.noHints)
          next.gamesWithoutHints = prev.gamesWithoutHints + 1;
        if (update.streak && update.streak > prev.bestStreak)
          next.bestStreak = update.streak;
        if (update.score && update.score > prev.bestScore)
          next.bestScore = update.score;
        if (
          update.addContinent &&
          !prev.continentsPlayed.includes(update.addContinent)
        ) {
          next.continentsPlayed = [
            ...prev.continentsPlayed,
            update.addContinent,
          ];
        }

        saveToStorage("accumulated_stats", next);

        // Check perfect game achievement inline
        if (update.perfectGame && !unlockedIds.includes("perfect_game")) {
          const def = ACHIEVEMENTS.find((a) => a.id === "perfect_game");
          if (def) {
            const newIds = [...unlockedIds, "perfect_game"];
            setUnlockedIds(newIds);
            saveToStorage("achievements_unlocked", newIds);
            toastQueue.current.push(def);
            if (!recentUnlock) {
              setTimeout(showNextToast, 0);
            }
          }
        }

        // Check achievements with new stats
        setTimeout(() => checkAndUnlock(next), 0);

        return next;
      });
    },
    [checkAndUnlock, unlockedIds, recentUnlock, showNextToast]
  );

  return (
    <AchievementsContext.Provider
      value={{
        unlockedIds,
        stats,
        recentUnlock,
        dismissToast,
        checkAndUnlock,
        updateStats,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const ctx = useContext(AchievementsContext);
  if (!ctx)
    throw new Error(
      "useAchievements must be used within AchievementsProvider"
    );
  return ctx;
};
