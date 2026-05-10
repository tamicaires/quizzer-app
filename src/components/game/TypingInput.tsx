import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypingInputProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
  hintLetter: string | null;
}

export default function TypingInput({ onSubmit, disabled, hintLetter }: TypingInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      setValue("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="words"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={hintLetter ? `Começa com "${hintLetter.toUpperCase()}"...` : "Digite sua resposta..."}
          required
          disabled={disabled}
          className={cn(
            "w-full h-14 rounded-2xl border bg-card px-5 pr-14 text-base",
            "transition-all duration-200",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            disabled ? "border-border opacity-50 cursor-default" : "border-border"
          )}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "flex items-center justify-center h-10 w-10 rounded-xl transition-all",
            disabled || !value.trim()
              ? "text-muted-foreground/40"
              : "bg-primary text-primary-foreground shadow-md active:scale-90"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
