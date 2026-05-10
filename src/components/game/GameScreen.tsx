import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import MenuScreen from "./MenuScreen";
import PlayingScreen from "./PlayingScreen";
import ResultsScreen from "./ResultsScreen";
import GameOverScreen from "./GameOverScreen";
import AchievementsPanel from "@/components/achievements/AchievementsPanel";
import HighScoresPanel from "@/components/settings/HighScoresPanel";

export default function GameScreen() {
  const { state } = useGame();

  const isPlaying = state.screen === "playing";

  const renderScreen = () => {
    switch (state.screen) {
      case "menu":
        return <MenuScreen />;
      case "playing":
        return <PlayingScreen />;
      case "results":
        return <ResultsScreen />;
      case "game-over":
        return <GameOverScreen />;
      case "achievements":
        return <AchievementsPanel />;
      case "high-scores":
        return <HighScoresPanel />;
    }
  };

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={state.screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={isPlaying ? "flex-1 flex flex-col overflow-hidden" : undefined}
      >
        {renderScreen()}
      </motion.div>
    </AnimatePresence>
  );
}
