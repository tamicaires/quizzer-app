import { motion } from "framer-motion";
import { HeartCrack, Home, RotateCcw, Target, Flame } from "lucide-react";
import { useGame } from "@/context/GameContext";

export default function GameOverScreen() {
  const { state, dispatch, startGame } = useGame();
  const config = state.config!;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto py-6 px-4 space-y-6">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
        className="flex items-center justify-center h-20 w-20 rounded-3xl bg-red-500/10 shadow-lg shadow-red-500/20 text-red-500"
      >
        <HeartCrack className="h-12 w-12" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-extrabold">Game Over</h2>
        <p className="text-sm text-muted-foreground">
          Vidas esgotadas, mas não desista!
        </p>
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 0.25 }}
        className="text-center"
      >
        <p className="text-5xl font-extrabold text-primary tabular-nums">
          {state.score}
        </p>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">
          pontos
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full grid grid-cols-2 gap-2"
      >
        <div className="rounded-2xl border border-border bg-card/50 p-3 text-center">
          <Target className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
          <p className="text-lg font-bold tabular-nums">
            {state.correctCount}/{state.currentQuestionIndex + 1}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Acertos
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-3 text-center">
          <Flame className="h-4 w-4 mx-auto mb-1 text-orange-500" />
          <p className="text-lg font-bold tabular-nums">{state.maxStreak}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Maior streak
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full flex gap-3 pt-2"
      >
        <button
          onClick={() => dispatch({ type: "GO_TO_MENU" })}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl border border-border bg-card text-sm font-semibold transition-all hover:bg-secondary active:scale-[0.97]"
        >
          <Home className="h-4 w-4" />
          Menu
        </button>
        <button
          onClick={() => startGame(config)}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-[0.97]"
        >
          <RotateCcw className="h-4 w-4" />
          Tentar de Novo
        </button>
      </motion.div>
    </div>
  );
}
