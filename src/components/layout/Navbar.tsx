import {
  BrainCircuit,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Trophy,
  BarChart3,
} from "lucide-react";
import { useTheme } from "@/context/themeContext";
import { useSettings } from "@/context/SettingsContext";
import { useGame } from "@/context/GameContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSettings();
  const { dispatch, state } = useGame();
  const isMenu = state.screen === "menu";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-12 px-4 max-w-screen-sm mx-auto">
        <button
          onClick={() => dispatch({ type: "GO_TO_MENU" })}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary text-primary-foreground">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">quizzer</span>
        </button>
        <div className="flex items-center gap-0.5">
          {isMenu && (
            <>
              <NavButton
                onClick={() => dispatch({ type: "GO_TO_ACHIEVEMENTS" })}
                label="Conquistas"
              >
                <Trophy className="h-4 w-4" />
              </NavButton>
              <NavButton
                onClick={() => dispatch({ type: "GO_TO_HIGH_SCORES" })}
                label="Recordes"
              >
                <BarChart3 className="h-4 w-4" />
              </NavButton>
            </>
          )}
          <NavButton onClick={toggleSound} label="Toggle som">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </NavButton>
          <NavButton onClick={toggleTheme} label="Toggle tema">
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </NavButton>
        </div>
      </div>
    </nav>
  );
}

function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="h-8 w-8 flex items-center justify-center rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary transition-all active:scale-90"
    >
      {children}
    </button>
  );
}
