import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Frown,
  Medal,
  RotateCcw,
  Home,
  Star,
  Target,
  Flame,
  Lightbulb,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useGame } from "@/context/GameContext";
import { useAchievements } from "@/context/AchievementsContext";
import { useHighScores } from "@/hooks/useHighScores";
import { saveDailyChallengeResult } from "@/services/daily-challenge.service";

export default function ResultsScreen() {
  const { state, dispatch, startGame } = useGame();
  const { updateStats } = useAchievements();
  const { addScore, isNewHighScore } = useHighScores();
  const processedRef = useRef(false);

  const config = state.config!;
  const total = config.questionCount;
  const correct = state.correctCount;
  const percentage = Math.round((correct / total) * 100);
  const newRecord = isNewHighScore(state.score);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    addScore({
      score: state.score,
      correctCount: correct,
      totalQuestions: total,
      difficulty: config.difficulty,
      mode: config.mode,
      continent: config.continent,
      date: new Date().toISOString(),
      maxStreak: state.maxStreak,
    });

    if (config.isDailyChallenge) {
      saveDailyChallengeResult(state.score, correct, total);
    }

    updateStats({
      addCorrect: correct,
      addIncorrect: state.incorrectCount,
      addGame: true,
      addDailyChallenge: config.isDailyChallenge || undefined,
      addContinent:
        config.continent !== "todos" ? config.continent : undefined,
      noHints: state.hintsUsedThisGame === 0 || undefined,
      streak: state.maxStreak,
      score: state.score,
      perfectGame: correct === total || undefined,
    });

    if (percentage >= 80) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }, []);

  const getPerformance = () => {
    if (percentage >= 80)
      return {
        icon: <Trophy className="h-12 w-12" />,
        title: "Excelente!",
        subtitle: "Conhecimento impressionante!",
        color: "text-yellow-500",
        glow: "shadow-yellow-500/20",
        bg: "bg-yellow-500/10",
      };
    if (percentage >= 60)
      return {
        icon: <Medal className="h-12 w-12" />,
        title: "Muito bom!",
        subtitle: "Quase lá!",
        color: "text-blue-500",
        glow: "shadow-blue-500/20",
        bg: "bg-blue-500/10",
      };
    if (percentage >= 40)
      return {
        icon: <Zap className="h-12 w-12" />,
        title: "Bom trabalho!",
        subtitle: "Continue praticando!",
        color: "text-emerald-500",
        glow: "shadow-emerald-500/20",
        bg: "bg-emerald-500/10",
      };
    return {
      icon: <Frown className="h-12 w-12" />,
      title: "Não desista!",
      subtitle: "Cada erro é um aprendizado.",
      color: "text-orange-500",
      glow: "shadow-orange-500/20",
      bg: "bg-orange-500/10",
    };
  };

  const perf = getPerformance();

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto py-6 px-4 space-y-6">
      {/* Icon + Title */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
        className={cn(
          "flex items-center justify-center h-20 w-20 rounded-3xl shadow-lg",
          perf.bg,
          perf.glow,
          perf.color
        )}
      >
        {perf.icon}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-1"
      >
        <h2 className="text-2xl font-extrabold">{perf.title}</h2>
        <p className="text-sm text-muted-foreground">{perf.subtitle}</p>
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

      {newRecord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 0.35 }}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-500/15 text-yellow-500"
        >
          <Star className="h-3.5 w-3.5 fill-yellow-500" />
          <span className="text-xs font-bold">Novo Recorde!</span>
          <Star className="h-3.5 w-3.5 fill-yellow-500" />
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full grid grid-cols-3 gap-2"
      >
        {[
          { icon: <Target className="h-4 w-4 text-emerald-500" />, value: `${correct}/${total}`, label: "Acertos" },
          { icon: <Flame className="h-4 w-4 text-orange-500" />, value: state.maxStreak, label: "Streak" },
          { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, value: state.hintsUsedThisGame, label: "Dicas" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card/50 p-3 text-center"
          >
            <div className="flex justify-center mb-1">{stat.icon}</div>
            <p className="text-lg font-bold tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
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
          onClick={() => {
            processedRef.current = false;
            startGame(config);
          }}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg transition-all hover:opacity-90 active:scale-[0.97]"
        >
          <RotateCcw className="h-4 w-4" />
          Jogar de Novo
        </button>
      </motion.div>
    </div>
  );
}
