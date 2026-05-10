import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Country } from "@/services/quiz.service";
import type { QuestionDirection } from "@/types/game.types";

interface QuestionDisplayProps {
  country: Country;
  direction: QuestionDirection;
}

function FlagImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-[280px] aspect-[3/2] rounded-2xl overflow-hidden shadow-lg bg-secondary">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="eager"
        onLoad={() => setLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
    </div>
  );
}

export default function QuestionDisplay({
  country,
  direction,
}: QuestionDisplayProps) {
  if (direction === "flag-to-country") {
    return (
      <motion.div
        key={country.name}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col items-center gap-3"
      >
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          Qual país?
        </p>
        <FlagImage src={country.flag} alt="Bandeira" />
      </motion.div>
    );
  }

  if (direction === "capital-to-country") {
    return (
      <motion.div
        key={country.name}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          Qual é o país?
        </p>
        <p className="text-3xl sm:text-4xl font-extrabold py-4 text-center">
          {country.capital}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={country.name}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-3"
    >
      <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
        Qual é a capital?
      </p>
      <FlagImage src={country.flag} alt={`Bandeira de ${country.name}`} />
      <p className="text-xl sm:text-2xl font-extrabold">{country.name}</p>
    </motion.div>
  );
}
