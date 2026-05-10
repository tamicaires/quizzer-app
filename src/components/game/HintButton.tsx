import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface HintButtonProps {
  onUseHint: () => void;
  hintUsed: boolean;
  disabled: boolean;
}

export default function HintButton({
  onUseHint,
  hintUsed,
  disabled,
}: HintButtonProps) {
  return (
    <motion.button
      whileTap={!disabled && !hintUsed ? { scale: 0.92 } : undefined}
      onClick={onUseHint}
      disabled={disabled || hintUsed}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all",
        hintUsed
          ? "bg-muted/40 text-muted-foreground/50 cursor-default"
          : disabled
            ? "bg-muted/20 text-muted-foreground/40 cursor-default"
            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/20 active:bg-yellow-500/25 cursor-pointer"
      )}
    >
      <Lightbulb className={cn("h-3.5 w-3.5", !hintUsed && !disabled && "drop-shadow-[0_0_3px_rgba(234,179,8,0.5)]")} />
      {hintUsed ? "Usada" : "Dica"}
    </motion.button>
  );
}
