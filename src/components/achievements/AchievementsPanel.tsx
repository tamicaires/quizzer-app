import { motion } from "framer-motion";
import { ArrowLeft, Lock, Trophy, Target, Flame, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/context/GameContext";
import { useAchievements } from "@/context/AchievementsContext";
import { ACHIEVEMENTS } from "@/constants/achievements.constants";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function AchievementsPanel() {
  const { dispatch } = useGame();
  const { unlockedIds, stats } = useAchievements();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-sm mx-auto space-y-5 py-2"
    >
      {/* Header */}
      <motion.div variants={fade} className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Conquistas</h2>
        <button
          onClick={() => dispatch({ type: "GO_TO_MENU" })}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fade} className="grid grid-cols-3 gap-2">
        {[
          { icon: <Gamepad2 className="h-4 w-4 text-primary" />, value: stats.totalGamesPlayed, label: "Jogos" },
          { icon: <Target className="h-4 w-4 text-emerald-500" />, value: stats.totalCorrect, label: "Acertos" },
          { icon: <Flame className="h-4 w-4 text-orange-500" />, value: stats.bestStreak, label: "Streak" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card/50 p-3 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-lg font-bold tabular-nums">{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Progress */}
      <motion.div variants={fade} className="flex items-center gap-3">
        <Trophy className="h-5 w-5 text-yellow-500 shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold">Progresso</span>
            <span className="text-muted-foreground tabular-nums">
              {unlockedIds.length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedIds.length / ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <div className="space-y-1.5">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = unlockedIds.includes(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              variants={fade}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                unlocked
                  ? "bg-primary/5 border-primary/15"
                  : "bg-muted/20 border-border/50 opacity-40"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-xl text-xl shrink-0",
                  unlocked ? "bg-primary/10" : "bg-muted"
                )}
              >
                {unlocked ? achievement.icon : <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{achievement.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
