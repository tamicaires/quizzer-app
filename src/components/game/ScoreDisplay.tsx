import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  streak: number;
}

export default function ScoreDisplay({ score, streak }: ScoreDisplayProps) {
  const multiplier = Math.min(streak, 5);

  return (
    <div className="flex items-center gap-2">
      <motion.span
        key={score}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="text-base font-bold tabular-nums"
      >
        {score}
        <span className="text-xs text-muted-foreground ml-0.5">pts</span>
      </motion.span>

      <AnimatePresence>
        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className={cn(
              "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold",
              streak >= 5
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30"
                : "bg-orange-500/15 text-orange-500"
            )}
          >
            {streak >= 5 ? <Sparkles className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
            x{multiplier}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
