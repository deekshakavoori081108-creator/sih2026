import React, { useState, useEffect } from 'react';
import { WordCryptItem } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { Volume2, Award, Sparkles, RefreshCw, CheckCircle2, Lightbulb, ArrowRight, Delete } from 'lucide-react';

interface WordCryptEngineProps {
  category: string;
  onLevelComplete: (score: number, timeSpentSeconds: number) => void;
  onExit: () => void;
}

export const WordCryptEngine: React.FC<WordCryptEngineProps> = ({
  category,
  onLevelComplete,
  onExit
}) => {
  const [words, setWords] = useState<WordCryptItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ id: string; letter: string; used: boolean }[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadWords() {
      try {
        setLoading(true);
        const data = await api.getGameChallenges(category, 'WORD_CRYPT');
        if (data.words && data.words.length > 0) {
          setWords(data.words);
          initWord(data.words[0]);
        }
      } catch (err) {
        console.error('Failed to load words:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWords();
  }, [category]);

  const initWord = (wordItem: WordCryptItem) => {
    const letters = wordItem.scrambled.split('').map((letter, idx) => ({
      id: `${letter}-${idx}-${Date.now()}`,
      letter,
      used: false
    }));
    setAvailableLetters(letters);
    setUserLetters([]);
    setIsSolved(false);
    setHintUsed(false);
  };

  const handlePickLetter = (item: { id: string; letter: string; used: boolean }) => {
    if (item.used || isSolved) return;

    const currentWord = words[currentIndex];
    if (userLetters.length >= currentWord.solution.length) return;

    setUserLetters((prev) => [...prev, item.letter]);
    setAvailableLetters((prev) =>
      prev.map((l) => (l.id === item.id ? { ...l, used: true } : l))
    );
  };

  const handleRemoveLetter = (index: number) => {
    if (isSolved) return;
    const letterToRemove = userLetters[index];

    // Find the first matching used letter in availableLetters to mark unused
    let restored = false;
    setAvailableLetters((prev) =>
      prev.map((l) => {
        if (!restored && l.letter === letterToRemove && l.used) {
          restored = true;
          return { ...l, used: false };
        }
        return l;
      })
    );

    setUserLetters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    if (isSolved) return;
    setUserLetters([]);
    setAvailableLetters((prev) => prev.map((l) => ({ ...l, used: false })));
  };

  // Check correctness when user filled all letters
  useEffect(() => {
    if (words.length === 0 || isSolved) return;
    const currentWord = words[currentIndex];

    if (userLetters.length === currentWord.solution.length) {
      const constructed = userLetters.join('');
      if (constructed.toUpperCase() === currentWord.solution.toUpperCase()) {
        setIsSolved(true);
        const gained = hintUsed ? currentWord.points - 15 : currentWord.points;
        setScore((prev) => prev + gained);

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }
  }, [userLetters, words, currentIndex, isSolved, hintUsed]);

  // Audio pronunciation using Web Speech Synthesis API
  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleHint = () => {
    if (hintUsed || isSolved) return;
    const currentWord = words[currentIndex];
    // Reveal next correct letter
    const nextIndex = userLetters.length;
    if (nextIndex < currentWord.solution.length) {
      const targetChar = currentWord.solution[nextIndex];
      // Find matching available letter
      const targetLetter = availableLetters.find((l) => l.letter === targetChar && !l.used);
      if (targetLetter) {
        handlePickLetter(targetLetter);
        setHintUsed(true);
      }
    }
  };

  const handleNextWord = () => {
    if (currentIndex + 1 < words.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      initWord(words[nextIdx]);
    } else {
      // Completed all words
      const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      onLevelComplete(score, timeSpent);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-epic text-amber-200">Decoding Ancient Lexicons...</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl">
        <p className="text-slate-300">No lexicon crypt terms found for this category.</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Back to Arcade</button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-3xl mx-auto glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
            {category} • Word Crypt & Lexicon
          </span>
          <h2 className="font-epic text-xl font-bold text-slate-100 mt-0.5">
            Decipher the Sacred Term {currentIndex + 1} of {words.length}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => playPronunciation(currentWord.solution)}
            title="Listen to Authentic Pronunciation"
            className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors flex items-center space-x-1 text-xs font-semibold"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hear Term</span>
          </button>

          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Scribe's Clue & Phonetics */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Scribe\'s Glyph Clue:
          </span>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {currentWord.phonetic}
          </span>
        </div>
        <p className="text-sm text-slate-200 font-medium leading-relaxed">
          "{currentWord.clue}"
        </p>
      </div>

      {/* Selected Letter Slots (Answer Line) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 min-h-[64px]">
        {Array.from({ length: currentWord.solution.length }).map((_, idx) => {
          const letter = userLetters[idx] || '';

          return (
            <button
              key={idx}
              onClick={() => letter && handleRemoveLetter(idx)}
              disabled={isSolved}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl font-epic text-2xl font-bold flex items-center justify-center border-2 transition-all transform ${
                letter
                  ? isSolved
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20 scale-105'
                    : 'bg-amber-500/20 border-amber-400 text-amber-200 hover:scale-95'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              {letter || '_'}
            </button>
          );
        })}
      </div>

      {/* Available Letters Pool */}
      {!isSolved && (
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {availableLetters.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePickLetter(item)}
                disabled={item.used}
                className={`w-11 h-12 sm:w-12 sm:h-14 rounded-xl font-epic text-xl font-bold border transition-all ${
                  item.used
                    ? 'opacity-20 bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'glass-panel hover:border-amber-400 hover:scale-105 bg-slate-900 text-slate-100 shadow-md active:scale-95'
                }`}
              >
                {item.letter}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={handleClear}
              disabled={userLetters.length === 0}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-colors"
            >
              <Delete className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={handleHint}
              disabled={hintUsed}
              className="px-4 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs font-bold text-indigo-300 hover:bg-indigo-900/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{hintUsed ? 'Hint Used' : 'Reveal Next Letter (-15 pts)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Solved Revelation Card */}
      {isSolved && (
        <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 space-y-3 mb-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Lexicon Decrypted: {currentWord.solution}!</span>
            </div>
            <button
              onClick={() => playPronunciation(currentWord.solution)}
              className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-300 hover:bg-emerald-800 text-xs flex items-center space-x-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentWord.historicalFact}
          </p>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextWord}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <span>{currentIndex + 1 < words.length ? 'Next Lexicon Crypt' : 'Finish Lexicon Challenge'}</span>
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
