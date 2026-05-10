import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAchievements } from "@/context/AchievementsContext";

export default function AchievementToast() {
  const { recentUnlock, dismissToast } = useAchievements();

  useEffect(() => {
    if (!recentUnlock) return;
    const timer = setTimeout(dismissToast, 4000);
    return () => clearTimeout(timer);
  }, [recentUnlock, dismissToast]);

  return (
    <AnimatePresence>
      {recentUnlock && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -60, x: "-50%" }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed top-16 left-1/2 z-50 cursor-pointer"
          onClick={dismissToast}
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-primary/20 bg-card/95 shadow-xl backdrop-blur-md">
            <span className="text-2xl">{recentUnlock.icon}</span>
            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-primary font-bold">
                Conquista!
              </p>
              <p className="font-bold text-sm leading-tight">{recentUnlock.name}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
