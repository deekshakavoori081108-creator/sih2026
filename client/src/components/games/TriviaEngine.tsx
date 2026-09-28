import React, { useState, useEffect } from 'react';
import { TriviaQuestion } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { Timer, Zap, Lightbulb, PauseCircle, CheckCircle, XCircle, Award, Sparkles, ArrowRight } from 'lucide-react';

interface TriviaEngineProps {
  category: string;
  onLevelComplete: (score: number, timeSpentSeconds: number) => void;
  onExit: () => void;
}

export const TriviaEngine: React.FC<TriviaEngineProps> = ({ category, onLevelComplete, onExit }) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [powerups, setPowerups] = useState({
    fiftyFifty: 1,
    hint: 1,
    timeFreeze: 1
  });
  const [startTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const data = await api.getGameChallenges(category, 'TRIVIA');
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error('Failed to load trivia questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [category]);

  // Countdown timer
  useEffect(() => {
    if (loading || isAnswered || isFinished || isTimerPaused) return;

    if (timer <= 0) {
      handleTimeOut();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isAnswered, isFinished, isTimerPaused, loading]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // timed out
    setStreak(0);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      const streakBonus = streak >= 2 ? 20 : 0;
      const speedBonus = timer > 15 ? 10 : 0;
      const gained = currentQ.points + streakBonus + speedBonus;
      setScore((prev) => prev + gained);
      setStreak((prev) => prev + 1);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimer(30);
      setHiddenOptions([]);
      setShowHint(false);
    } else {
      // Completed all questions
      setIsFinished(true);
      const totalSeconds = Math.max(10, Math.round((Date.now() - startTime) / 1000));
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onLevelComplete(score, totalSeconds);
    }
  };

  // Power-up 1: 50/50
  const useFiftyFifty = () => {
    if (powerups.fiftyFifty <= 0 || isAnswered) return;
    const currentQ = questions[currentIndex];
    const wrongIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctIndex);
    
    // Pick 2 wrong indices to hide
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptions(toHide);
    setPowerups((p) => ({ ...p, fiftyFifty: p.fiftyFifty - 1 }));
  };

  // Power-up 2: Scribe Hint
  const useHint = () => {
    if (powerups.hint <= 0 || isAnswered) return;
    setShowHint(true);
    setPowerups((p) => ({ ...p, hint: p.hint - 1 }));
  };

  // Power-up 3: Time Freeze
  const useTimeFreeze = () => {
    if (powerups.timeFreeze <= 0 || isAnswered) return;
    setIsTimerPaused(true);
    setPowerups((p) => ({ ...p, timeFreeze: p.timeFreeze - 1 }));
    setTimeout(() => {
      setIsTimerPaused(false);
    }, 15000); // 15 seconds freeze
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-epic text-amber-200">Summoning Historical Scrolls...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl">
        <p className="text-slate-300">No questions found for this topic. Please select another category.</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Back to Arcade</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative">
      
      {/* Top Header: Score, Progress & Timer */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
            {category} • Trivia Conquest
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm font-semibold text-slate-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {streak >= 2 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/40">
                🔥 {streak}x Streak!
              </span>
            )}
          </div>
        </div>

        {/* Timer Bar */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold ${
            isTimerPaused
              ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 animate-pulse'
              : timer <= 10
              ? 'bg-rose-950/60 border-rose-500 text-rose-300'
              : 'bg-slate-900 border-slate-700 text-slate-200'
          }`}>
            <Timer className="w-4 h-4 text-amber-400" />
            <span>{timer}s</span>
            {isTimerPaused && <span className="text-[10px] text-cyan-400 ml-1">FROZEN</span>}
          </div>

          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-6 border border-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
          style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Power-ups Bar */}
      <div className="flex items-center justify-between mb-6 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Power-ups:</span>
        <div className="flex items-center space-x-2">
          
          <button
            onClick={useFiftyFifty}
            disabled={powerups.fiftyFifty <= 0 || isAnswered}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              powerups.fiftyFifty > 0 && !isAnswered
                ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/50'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>50/50 ({powerups.fiftyFifty})</span>
          </button>

          <button
            onClick={useHint}
            disabled={powerups.hint <= 0 || isAnswered}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              powerups.hint > 0 && !isAnswered
                ? 'bg-amber-600/30 border border-amber-500/50 text-amber-300 hover:bg-amber-600/50'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint ({powerups.hint})</span>
          </button>

          <button
            onClick={useTimeFreeze}
            disabled={powerups.timeFreeze <= 0 || isAnswered || isTimerPaused}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              powerups.timeFreeze > 0 && !isAnswered && !isTimerPaused
                ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/50'
                : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>Freeze ({powerups.timeFreeze})</span>
          </button>

        </div>
      </div>

      {/* Scribe Hint Box */}
      {showHint && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-2 text-xs text-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Scribe\'s Insight: </strong>
            <span>{currentQ.hint}</span>
          </div>
        </div>
      )}

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="font-epic text-lg sm:text-xl font-bold text-slate-100 leading-snug">
          {currentQ.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {currentQ.options.map((option, idx) => {
          if (hiddenOptions.includes(idx)) return null;

          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let btnStyle = 'glass-panel hover:border-amber-500/50 bg-slate-900/60 text-slate-200';
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
            } else if (isSelected) {
              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
            } else {
              btnStyle = 'opacity-40 glass-panel text-slate-500';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm sm:text-base flex items-center justify-between transition-all transform ${
                !isAnswered ? 'hover:-translate-y-0.5' : ''
              } ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswered && (
                <span>
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : null}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Educational Explanation Box upon Answer */}
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 mb-6 animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Historical & Cultural Revelation:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentQ.explanation}
          </p>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Claim Conquest Rewards'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Exit Button */}
      <div className="flex justify-start">
        <button
          onClick={onExit}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Return to Arcade
        </button>
      </div>

    </div>
  );
};
