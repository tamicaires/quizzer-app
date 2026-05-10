import { cn } from "@/lib/utils";
import type { FeedbackState } from "@/types/game.types";

interface MultipleChoiceGridProps {
  options: string[];
  correctAnswer: string;
  onSelect: (option: string) => void;
  disabled: boolean;
  feedbackState: FeedbackState;
  selectedOption: string | null;
}

const labels = ["A", "B", "C", "D"];

export default function MultipleChoiceGrid({
  options,
  correctAnswer,
  onSelect,
  disabled,
  feedbackState,
  selectedOption,
}: MultipleChoiceGridProps) {
  const showFeedback = feedbackState !== "idle";

  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option, i) => {
        const isCorrect = showFeedback && option === correctAnswer;
        const isWrongSelected =
          showFeedback && option === selectedOption && feedbackState === "incorrect";

        return (
          <button
            key={option}
            onClick={() => onSelect(option)}
            disabled={disabled}
            className={cn(
              "relative flex items-center gap-2.5 w-full rounded-2xl px-3 py-4 text-left",
              "border text-sm font-medium transition-all duration-150",
              "focus:outline-none focus-visible:outline-none",
              "active:scale-[0.96] min-h-[56px]",
              isCorrect
                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30"
                : isWrongSelected
                  ? "bg-red-500/15 border-red-500/50 text-red-700 dark:text-red-300 ring-2 ring-red-500/30"
                  : disabled
                    ? "border-border bg-muted/20 text-muted-foreground cursor-default"
                    : "border-border bg-card cursor-pointer"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center h-7 w-7 rounded-lg text-[11px] font-bold shrink-0",
                isCorrect
                  ? "bg-emerald-500 text-white"
                  : isWrongSelected
                    ? "bg-red-500 text-white"
                    : "bg-secondary text-muted-foreground"
              )}
            >
              {labels[i]}
            </span>
            <span className="flex-1 leading-tight">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
