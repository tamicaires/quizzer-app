import { ThemeProvider } from "./context/themeContext";
import { SettingsProvider } from "./context/SettingsContext";
import { AchievementsProvider } from "./context/AchievementsContext";
import { GameProvider } from "./context/GameContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import GameScreen from "./components/game/GameScreen";
import AchievementToast from "./components/achievements/AchievementToast";
import { useGame } from "./context/GameContext";

function AppContent() {
  const { state } = useGame();
  const isPlaying = state.screen === "playing";

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <Navbar />
      <main
        className={
          isPlaying
            ? "flex-1 flex flex-col overflow-hidden"
            : "flex-1 overflow-y-auto"
        }
      >
        <div
          className={
            isPlaying
              ? "flex-1 flex flex-col overflow-hidden"
              : "w-full max-w-screen-sm mx-auto px-4 pt-6 pb-4"
          }
        >
          <GameScreen />
        </div>
        {!isPlaying && <Footer />}
      </main>
      <AchievementToast />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AchievementsProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </AchievementsProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
