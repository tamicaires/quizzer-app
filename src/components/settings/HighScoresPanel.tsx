import { motion } from "framer-motion";
import { ArrowLeft, Crown, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/context/GameContext";
import { useHighScores } from "@/hooks/useHighScores";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const rankIcons = [
  <Crown key="gold" className="h-5 w-5 text-yellow-500" />,
  <Medal key="silver" className="h-5 w-5 text-slate-400" />,
  <Award key="bronze" className="h-5 w-5 text-amber-700" />,
];

export default function HighScoresPanel() {
  const { dispatch } = useGame();
  const { scores } = useHighScores();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-sm mx-auto space-y-5 py-2"
    >
      <motion.div variants={fade} className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Recordes</h2>
        <button
          onClick={() => dispatch({ type: "GO_TO_MENU" })}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </motion.div>

      {scores.length === 0 ? (
        <motion.div
          variants={fade}
          className="rounded-2xl border border-border bg-card/50 p-10 text-center"
        >
          <Crown className="h-10 w-10 mx-auto text-muted-foreground/20 mb-3" />
          <p className="text-muted-foreground font-medium">Nenhum recorde ainda.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Jogue para aparecer aqui!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-1.5">
          {scores.map((entry, i) => (
            <motion.div
              key={`${entry.date}-${i}`}
              variants={fade}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                i === 0
                  ? "border-yellow-500/25 bg-yellow-500/5"
                  : "border-border bg-card/50"
              )}
            >
              <div className="flex items-center justify-center w-8 shrink-0">
                {i < 3 ? (
                  rankIcons[i]
                ) : (
                  <span className="text-sm font-bold text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary tabular-nums">
                    {entry.score} pts
                  </span>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {entry.correctCount}/{entry.totalQuestions} acertos
                  {" · "}
                  {entry.difficulty}
                  {" · "}
                  streak {entry.maxStreak}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
