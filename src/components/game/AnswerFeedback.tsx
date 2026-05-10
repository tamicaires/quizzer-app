import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedbackState } from "@/types/game.types";

interface AnswerFeedbackProps {
  feedbackState: FeedbackState;
  correctAnswer: string;
  streak: number;
}

export default function AnswerFeedback({
  feedbackState,
  correctAnswer,
  streak,
}: AnswerFeedbackProps) {
  if (feedbackState === "idle") return null;

  const isCorrect = feedbackState === "correct";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="overflow-hidden"
      >
        <div
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 rounded-xl",
            isCorrect
              ? "bg-emerald-500/10"
              : "bg-red-500/10"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center h-5 w-5 rounded-full",
              isCorrect ? "bg-emerald-500" : "bg-red-500"
            )}
          >
            {isCorrect ? (
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            ) : (
              <X className="h-3 w-3 text-white" strokeWidth={3} />
            )}
          </div>
          <span
            className={cn(
              "font-bold text-sm",
              isCorrect
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {isCorrect ? "Correto!" : "Incorreto"}
          </span>
          {isCorrect && streak >= 3 && (
            <span className="flex items-center gap-0.5 text-xs font-bold text-orange-500">
              <Flame className="h-3 w-3" />
              {streak}x
            </span>
          )}
          {!isCorrect && (
            <span className="text-xs text-muted-foreground ml-1">
              &mdash; <strong className="text-foreground">{correctAnswer}</strong>
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
