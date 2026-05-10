import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Zap,
  BookOpen,
  Flame,
  Heart,
  Timer,
  Keyboard,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  Target,
  Globe,
  Map,
  Flag,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/context/GameContext";
import { useAchievements } from "@/context/AchievementsContext";
import {
  CONTINENTS,
  DEFAULT_QUESTION_COUNT,
  DIFFICULTY_CONFIGS,
  MIN_QUESTION_COUNT,
  MAX_QUESTION_COUNT,
  DAILY_CHALLENGE_QUESTION_COUNT,
} from "@/constants/game.constants";
import type {
  Difficulty,
  QuestionDirection,
  GameConfig,
} from "@/types/game.types";
import {
  hasDailyChallengeBeenPlayed,
  getDailyChallengeResult,
} from "@/services/daily-challenge.service";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function MenuScreen() {
  const { startGame } = useGame();
  const { stats } = useAchievements();

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [direction, setDirection] = useState<QuestionDirection>("country-to-capital");
  const [continent, setContinent] = useState("todos");
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const dailyPlayed = hasDailyChallengeBeenPlayed();
  const dailyResult = getDailyChallengeResult();

  const handleStart = (diff: Difficulty, daily = false) => {
    const dc = DIFFICULTY_CONFIGS[diff];
    const config: GameConfig = {
      mode: daily ? "multiple-choice" : dc.mode,
      direction,
      difficulty: diff,
      continent: daily ? "todos" : continent,
      questionCount: daily ? DAILY_CHALLENGE_QUESTION_COUNT : questionCount,
      timerSeconds: daily ? null : dc.timerSeconds,
      livesTotal: daily ? 3 : dc.livesTotal,
      isDailyChallenge: daily,
    };
    startGame(config);
  };

  const difficulties: {
    key: Difficulty;
    emoji: string;
    label: string;
    sub: string;
    tags: { icon: React.ReactNode; t: string }[];
    color: string;
    bg: string;
    ring: string;
  }[] = [
    {
      key: "easy",
      emoji: "",
      label: "Iniciante",
      sub: "4 opções",
      tags: [
        { icon: <MousePointerClick className="h-3 w-3" />, t: "Escolha" },
        { icon: <Heart className="h-3 w-3" />, t: "5 vidas" },
      ],
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/40",
    },
    {
      key: "medium",
      emoji: "",
      label: "Explorador",
      sub: "Digitação",
      tags: [
        { icon: <Keyboard className="h-3 w-3" />, t: "Digite" },
        { icon: <Heart className="h-3 w-3" />, t: "3 vidas" },
      ],
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/40",
    },
    {
      key: "hard",
      emoji: "",
      label: "Mestre",
      sub: "Timer + digitação",
      tags: [
        { icon: <Timer className="h-3 w-3" />, t: "12s" },
        { icon: <Keyboard className="h-3 w-3" />, t: "Digite" },
        { icon: <Heart className="h-3 w-3" />, t: "3 vidas" },
      ],
      color: "text-red-500",
      bg: "bg-red-500/10",
      ring: "ring-red-500/40",
    },
  ];

  const dirs: { v: QuestionDirection; icon: React.ReactNode; short: string }[] = [
    { v: "country-to-capital", icon: <Target className="h-4 w-4" />, short: "Capital" },
    { v: "capital-to-country", icon: <Map className="h-4 w-4" />, short: "País" },
    { v: "flag-to-country", icon: <Flag className="h-4 w-4" />, short: "Bandeira" },
  ];

  const diffIcons = {
    easy: <BookOpen className="h-6 w-6" />,
    medium: <Zap className="h-6 w-6" />,
    hard: <Flame className="h-6 w-6" />,
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="w-full max-w-lg mx-auto flex flex-col gap-6"
    >
      {/* ---- Hero ---- */}
      <motion.div variants={fadeUp} className="text-center pt-2">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-3 animate-bounce-in">
          <Globe className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Quiz de Capitais
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Teste seus conhecimentos sobre o mundo
        </p>

        {/* Mini stats */}
        {stats.totalGamesPlayed > 0 && (
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-yellow-500" />
              {stats.bestScore}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              {stats.bestStreak}
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-primary" />
              {stats.totalCorrect}
            </span>
          </div>
        )}
      </motion.div>

      {/* ---- Daily Challenge ---- */}
      <motion.div variants={fadeUp}>
        <button
          onClick={() => !dailyPlayed && handleStart("easy", true)}
          disabled={dailyPlayed}
          className={cn(
            "w-full rounded-2xl px-5 py-4 text-left relative overflow-hidden",
            "border transition-all duration-300",
            dailyPlayed
              ? "border-border opacity-50 cursor-default"
              : "border-primary/30 active:scale-[0.97] cursor-pointer"
          )}
        >
          {!dailyPlayed && (
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          )}
          <div className="relative flex items-center gap-4">
            <div
              className={cn(
                "flex items-center justify-center h-12 w-12 rounded-2xl shrink-0",
                "bg-primary/15 text-primary",
                !dailyPlayed && "animate-glow-pulse"
              )}
            >
              <CalendarDays className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold">Desafio Diário</span>
                {!dailyPlayed && <Sparkles className="h-3.5 w-3.5 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {dailyPlayed && dailyResult
                  ? `Concluído! ${dailyResult.correctCount}/${dailyResult.totalQuestions} (${dailyResult.score} pts)`
                  : "10 perguntas iguais para todos hoje"}
              </p>
            </div>
            {!dailyPlayed && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full shrink-0">
                Jogar
              </span>
            )}
          </div>
        </button>
      </motion.div>

      {/* ---- Direction pills ---- */}
      <motion.div variants={fadeUp} className="flex gap-2">
        {dirs.map((d) => (
          <button
            key={d.v}
            onClick={() => setDirection(d.v)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all",
              "border text-xs font-medium",
              "active:scale-95",
              direction === d.v
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:border-primary/40"
            )}
          >
            {d.icon}
            <span>{d.short}</span>
          </button>
        ))}
      </motion.div>

      {/* ---- Difficulty selector ---- */}
      <motion.div variants={fadeUp} className="space-y-3">
        {/* Difficulty tabs */}
        <div className="grid grid-cols-3 gap-2">
          {difficulties.map((d) => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all",
                "border text-center",
                "active:scale-95",
                difficulty === d.key
                  ? cn("ring-2", d.ring, d.bg, "border-transparent")
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              <div className={cn("transition-colors", difficulty === d.key ? d.color : "text-muted-foreground")}>
                {diffIcons[d.key]}
              </div>
              <span className="text-xs font-bold">{d.label}</span>
              <span className="text-[10px] text-muted-foreground leading-none">{d.sub}</span>
            </button>
          ))}
        </div>

        {/* Selected difficulty detail tags */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {difficulties
            .find((d) => d.key === difficulty)
            ?.tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-[11px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full"
              >
                {tag.icon}
                {tag.t}
              </span>
            ))}
        </div>
      </motion.div>

      {/* ---- Play button ---- */}
      <motion.div variants={fadeUp}>
        <button
          onClick={() => handleStart(difficulty)}
          className={cn(
            "w-full h-14 rounded-2xl font-bold text-base",
            "bg-primary text-primary-foreground",
            "flex items-center justify-center gap-2",
            "active:scale-[0.97] transition-transform",
            "shadow-lg shadow-primary/25",
            "hover:shadow-xl hover:shadow-primary/30"
          )}
        >
          <Play className="h-5 w-5" />
          Jogar
        </button>
      </motion.div>

      {/* ---- Advanced toggle ---- */}
      <motion.div variants={fadeUp}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-center gap-1 w-full py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          Opções avançadas
        </button>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 p-4 rounded-2xl border border-border bg-card space-y-4"
          >
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5 text-muted-foreground">
                <Globe className="h-3.5 w-3.5" /> Continente
              </label>
              <Select value={continent} onValueChange={setContinent}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTINENTS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "todos" ? "Todos os continentes" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Perguntas
              </label>
              <div className="flex gap-2">
                {[5, 10, 20, 30].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={cn(
                      "flex-1 h-10 rounded-xl text-sm font-medium transition-all border",
                      "active:scale-95",
                      questionCount === n
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {n}
                  </button>
                ))}
                <Input
                  type="number"
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(
                      Math.max(MIN_QUESTION_COUNT, Math.min(MAX_QUESTION_COUNT, Number(e.target.value)))
                    )
                  }
                  min={MIN_QUESTION_COUNT}
                  max={MAX_QUESTION_COUNT}
                  className="w-16 h-10 rounded-xl text-center"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
