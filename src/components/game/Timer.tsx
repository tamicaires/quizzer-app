import { cn } from "@/lib/utils";

interface TimerProps {
  fraction: number | null;
  timeRemaining: number | null;
}

export default function Timer({ fraction, timeRemaining }: TimerProps) {
  if (fraction === null || timeRemaining === null) return null;

  const seconds = Math.ceil(timeRemaining);
  const isLow = fraction < 0.25;
  const isMid = fraction < 0.5;

  return (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-100 ease-linear",
            isLow
              ? "bg-red-500"
              : isMid
                ? "bg-yellow-500"
                : "bg-emerald-500"
          )}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
      <span
        className={cn(
          "text-[10px] font-bold tabular-nums shrink-0",
          isLow
            ? "text-red-500 animate-pulse"
            : isMid
              ? "text-yellow-500"
              : "text-muted-foreground"
        )}
      >
        {seconds}s
      </span>
    </div>
  );
}
