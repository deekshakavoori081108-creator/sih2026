import React, { useState, useEffect } from 'react';
import { ArtifactPuzzle, ArtifactItem } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { ArrowUp, ArrowDown, CheckCircle2, Award, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

interface ArtifactPuzzleEngineProps {
  category: string;
  onLevelComplete: (score: number, timeSpentSeconds: number) => void;
  onExit: () => void;
}

export const ArtifactPuzzleEngine: React.FC<ArtifactPuzzleEngineProps> = ({
  category,
  onLevelComplete,
  onExit
}) => {
  const [puzzle, setPuzzle] = useState<ArtifactPuzzle | null>(null);
  const [items, setItems] = useState<ArtifactItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPuzzle() {
      try {
        setLoading(true);
        const data = await api.getGameChallenges(category, 'PUZZLE');
        if (data.puzzles && data.puzzles.length > 0) {
          const selected = data.puzzles[0];
          setPuzzle(selected);
          // Shuffle items for the puzzle
          const shuffled = [...selected.items].sort(() => Math.random() - 0.5);
          setItems(shuffled);
        }
      } catch (err) {
        console.error('Failed to load artifact puzzle:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPuzzle();
  }, [category]);

  const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
    if (isSubmitted && isCorrect) return;

    const newIndex = direction === 'UP' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setItems(updated);
    setIsSubmitted(false);
  };

  const handleVerify = () => {
    let allMatches = true;
    for (let i = 0; i < items.length; i++) {
      if (items[i].correctOrder !== i + 1) {
        allMatches = false;
        break;
      }
    }

    setIsSubmitted(true);
    setIsCorrect(allMatches);

    if (allMatches) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      onLevelComplete(puzzle?.points || 80, timeSpent);
    }
  };

  const handleReset = () => {
    if (!puzzle) return;
    const reshuffled = [...puzzle.items].sort(() => Math.random() - 0.5);
    setItems(reshuffled);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-epic text-amber-200">Unearthing Ancient Artifact Relics...</p>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl">
        <p className="text-slate-300">No artifact puzzle available for this category yet.</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Back to Arcade</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
            {category} • Artifact Chrono-Puzzle
          </span>
          <h2 className="font-epic text-xl sm:text-2xl font-bold text-slate-100 mt-1">
            {puzzle.title}
          </h2>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{puzzle.points} pts</span>
        </div>
      </div>

      {/* Objective Card */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6 flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-slate-400 font-medium">Mission Directive:</p>
          <p className="text-xs sm:text-sm text-slate-200 font-semibold">{puzzle.objective}</p>
        </div>
      </div>

      {/* Artifact Sequence Cards */}
      <div className="space-y-3 mb-6">
        {items.map((item, index) => {
          const isSlotCorrect = isSubmitted && item.correctOrder === index + 1;
          const isSlotWrong = isSubmitted && item.correctOrder !== index + 1;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                isSlotCorrect
                  ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10'
                  : isSlotWrong
                  ? 'bg-rose-950/40 border-rose-500/60 text-slate-200'
                  : 'glass-panel border-slate-800 bg-slate-900/60 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                {/* Step Position Indicator */}
                <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${
                  isSlotCorrect
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  #{index + 1}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-inner">
                  {item.icon}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-slate-100">{item.title}</h4>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                      {item.yearOrEra}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                </div>
              </div>

              {/* Up / Down Controls */}
              <div className="flex flex-col space-y-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(index, 'UP')}
                  disabled={index === 0 || (isSubmitted && isCorrect)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'DOWN')}
                  disabled={index === items.length - 1 || (isSubmitted && isCorrect)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Result Status & Lore */}
      {isSubmitted && (
        <div className={`p-4 rounded-2xl border mb-6 ${
          isCorrect
            ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-200'
            : 'bg-rose-950/70 border-rose-500/70 text-rose-200'
        }`}>
          <div className="flex items-center space-x-2 font-bold text-sm mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Chrono-Sequence Harmonized! Perfect Historical Alignment.</span>
              </>
            ) : (
              <>
                <span>⚠️ Alignment Incomplete. Some artifacts are out of chronological order!</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            {puzzle.culturalLore}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onExit}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Return to Arcade
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Reshuffle Relics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isCorrect ? 'Artifacts Verified ✓' : 'Verify Alignment'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
