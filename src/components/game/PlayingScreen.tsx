import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/context/GameContext";
import { useTimer } from "@/hooks/useTimer";
import { useSound } from "@/hooks/useSound";
import {
  getCorrectAnswer,
  checkAnswer,
  getHintFirstLetter,
  eliminateOptions,
} from "@/services/quiz.service";
import { FEEDBACK_DISPLAY_MS } from "@/constants/game.constants";
import ProgressBar from "./ProgressBar";
import Timer from "./Timer";
import LivesDisplay from "./LivesDisplay";
import ScoreDisplay from "./ScoreDisplay";
import QuestionDisplay from "./QuestionDisplay";
import TypingInput from "./TypingInput";
import MultipleChoiceGrid from "./MultipleChoiceGrid";
import HintButton from "./HintButton";
import AnswerFeedback from "./AnswerFeedback";

export default function PlayingScreen() {
  const { state, dispatch, nextQuestion } = useGame();
  const { playCorrect, playIncorrect, playStreak } = useSound();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [displayOptions, setDisplayOptions] = useState<string[]>(state.currentOptions);
  const [hintLetter, setHintLetter] = useState<string | null>(null);
  const [scorePop, setScorePop] = useState<{ key: number; pts: number } | null>(null);
  const [shaking, setShaking] = useState(false);
  const popKey = useRef(0);

  const config = state.config!;
  const country = state.currentCountry!;
  const correctAnswer = getCorrectAnswer(country, config.direction);

  const handleTimerExpire = useCallback(() => {
    if (state.feedbackState !== "idle") return;
    dispatch({ type: "TIMER_EXPIRED" });
    playIncorrect();
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, [dispatch, playIncorrect, state.feedbackState]);

  const { timeRemaining, fraction, reset: resetTimer } = useTimer({
    totalSeconds: config.timerSeconds,
    onExpire: handleTimerExpire,
    running: state.feedbackState === "idle",
  });

  useEffect(() => {
    setDisplayOptions(state.currentOptions);
    setSelectedOption(null);
    setHintLetter(null);
    resetTimer();
  }, [state.currentQuestionIndex, state.currentOptions, resetTimer]);

  const proceedAfterFeedback = useCallback(() => {
    const isLast = state.currentQuestionIndex + 1 >= config.questionCount;
    if (state.livesRemaining <= 0 || isLast) {
      dispatch({ type: "SHOW_RESULTS" });
      return;
    }
    nextQuestion();
  }, [state.currentQuestionIndex, state.livesRemaining, config.questionCount, dispatch, nextQuestion]);

  const prevScore = useRef(state.score);
  useEffect(() => {
    if (state.score > prevScore.current) {
      const pts = state.score - prevScore.current;
      popKey.current += 1;
      setScorePop({ key: popKey.current, pts });
      setTimeout(() => setScorePop(null), 900);
    }
    prevScore.current = state.score;
  }, [state.score]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (state.feedbackState !== "idle") return;
      const isCorrect = checkAnswer(answer, correctAnswer);
      setSelectedOption(answer);

      if (isCorrect) {
        dispatch({ type: "ANSWER_CORRECT", timeRemaining });
        const newStreak = state.streak + 1;
        if (newStreak >= 3) playStreak();
        else playCorrect();
      } else {
        dispatch({ type: "ANSWER_INCORRECT" });
        playIncorrect();
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }

      setTimeout(proceedAfterFeedback, FEEDBACK_DISPLAY_MS);
    },
    [state.feedbackState, state.streak, correctAnswer, timeRemaining, dispatch, playCorrect, playIncorrect, playStreak, proceedAfterFeedback]
  );

  const handleHint = useCallback(() => {
    dispatch({ type: "USE_HINT" });
    if (config.mode === "multiple-choice") {
      setDisplayOptions(eliminateOptions(displayOptions, correctAnswer));
    } else {
      setHintLetter(getHintFirstLetter(correctAnswer));
    }
  }, [dispatch, config.mode, displayOptions, correctAnswer]);

  const isFeedback = state.feedbackState !== "idle";

  return (
    <div className={cn("flex-1 flex flex-col w-full max-w-lg mx-auto", shaking && "animate-shake")}>
      {/* ---- Top HUD ---- */}
      <div className="px-4 pt-3 pb-2 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="relative">
            <ScoreDisplay score={state.score} streak={state.streak} />
            {/* Floating +points */}
            <AnimatePresence>
              {scorePop && (
                <motion.span
                  key={scorePop.key}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -36 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute -top-1 left-16 text-sm font-bold text-primary pointer-events-none"
                >
                  +{scorePop.pts}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2">
            <LivesDisplay current={state.livesRemaining} total={config.livesTotal} />
            <button
              onClick={() => dispatch({ type: "GO_TO_MENU" })}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ProgressBar current={state.currentQuestionIndex} total={config.questionCount} />
        <Timer fraction={fraction} timeRemaining={timeRemaining} />
      </div>

      {/* ---- Question zone (flexible, centered) ---- */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 min-h-0 overflow-hidden">
        <div className="w-full">
          <QuestionDisplay country={country} direction={config.direction} />
        </div>
      </div>

      {/* ---- Answer zone (anchored to bottom — thumb area) ---- */}
      <div className="shrink-0 px-4 pb-4 safe-bottom space-y-3">
        <AnswerFeedback feedbackState={state.feedbackState} correctAnswer={correctAnswer} streak={state.streak} />

        {config.mode === "multiple-choice" ? (
          <MultipleChoiceGrid
            options={displayOptions}
            correctAnswer={correctAnswer}
            onSelect={handleAnswer}
            disabled={isFeedback}
            feedbackState={state.feedbackState}
            selectedOption={selectedOption}
          />
        ) : (
          <TypingInput onSubmit={handleAnswer} disabled={isFeedback} hintLetter={hintLetter} />
        )}

        <div className="flex justify-center">
          <HintButton onUseHint={handleHint} hintUsed={state.hintUsed} disabled={isFeedback} />
        </div>
      </div>
    </div>
  );
}
