import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivesDisplayProps {
  current: number;
  total: number;
}

export default function LivesDisplay({ current, total }: LivesDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => {
        const alive = i < current;
        const justLost = i === current;

        return (
          <motion.div
            key={i}
            animate={
              justLost
                ? { scale: [1, 1.4, 0], opacity: [1, 1, 0], rotate: [0, -15, 30] }
                : {}
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-all duration-300",
                alive
                  ? "fill-red-500 text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]"
                  : "text-muted-foreground/15"
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
