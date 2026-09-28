import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, ArrowRight, Zap, Award, Sparkles, Filter } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../components/CategorySelector';

interface ArcadeProps {
  navigate: (path: string) => void;
}

export const Arcade: React.FC<ArcadeProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    user?.preferredCategory || 'Ramayana & Epics'
  );

  const gameTypes = [
    {
      id: 'TRIVIA',
      title: 'Trivia Conquest',
      subtitle: 'Timed Quiz with Tactical Power-ups',
      icon: '⚔️',
      gradient: 'from-amber-600/30 via-orange-600/20 to-slate-900 border-amber-500/40',
      badge: '50/50 • Hints • Time Freeze',
      points: '+50 Pts / Quiz',
      xp: '+75 XP',
      description: 'Answer high-yield historical and epic questions before the hourglass runs out. Activate 50/50 eliminations and Scribe insights to maintain your win streak.'
    },
    {
      id: 'PUZZLE',
      title: 'Artifact Chrono-Puzzle',
      subtitle: 'Timeline & Milestone Synchronization',
      icon: '🏺',
      gradient: 'from-emerald-600/30 via-teal-600/20 to-slate-900 border-emerald-500/40',
      badge: 'Interactive Sequencing',
      points: '+80 Pts / Puzzle',
      xp: '+120 XP',
      description: 'Reconstruct historical sequences from Harappan brickworks to sacred epic milestones. Align the ancient relics in true chronological harmony.'
    },
    {
      id: 'WORD_CRYPT',
      title: 'Word Crypt & Lexicon',
      subtitle: 'Ancient Glyph & Term Unscrambler',
      icon: '🔠',
      gradient: 'from-purple-600/30 via-indigo-600/20 to-slate-900 border-purple-500/40',
      badge: 'Phonetic Audio Speech',
      points: '+60 Pts / Term',
      xp: '+90 XP',
      description: 'Decipher scrambled ancient terms, Sanskrit roots, and scientific concepts. Hear authentic audio pronunciations and uncover hidden historical definitions.'
    }
  ];

  const levelsCompleted = user?.totalLevelsCompleted || 0;
  const cycleCount = levelsCompleted % 2;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Interactive Game Arena Hub</span>
          </div>

          <h1 className="font-epic text-3xl sm:text-4xl font-extrabold text-slate-100">
            The Arcade of Civilizations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Choose an interactive challenge archetype. Triumph in any 2 levels to trigger the dynamic generation of your next cliffhanger chapter!
          </p>
        </div>

        {/* Category Filter Selector */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3 shrink-0">
          <Filter className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400 block">Current Focus:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-amber-300 font-bold outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.name} className="bg-slate-900 text-slate-200">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2-Level Story Unlock Callout Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-epic text-sm font-bold text-amber-200">
              Progression Metric: {cycleCount} of 2 Levels Completed
            </h4>
            <p className="text-xs text-slate-300">
              {cycleCount === 1 
                ? 'Only 1 more level needed to unlock your next suspenseful story chapter!'
                : 'Win 2 games to unlock the next chapter in your learning quest.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-xs text-slate-400">Total Levels:</span>
          <span className="font-epic font-bold text-sm text-slate-200 ml-1.5">{levelsCompleted} Cleared</span>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gameTypes.map((game) => (
          <div
            key={game.id}
            className={`glass-panel rounded-3xl p-6 sm:p-8 border hover:border-amber-500/40 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 bg-gradient-to-br ${game.gradient}`}
          >
            <div>
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-3xl shadow-inner">
                  {game.icon}
                </div>

                <span className="px-3 py-1 rounded-full bg-slate-800/80 text-amber-300 text-[10px] font-bold border border-slate-700">
                  {game.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-epic text-2xl font-bold text-slate-100 mb-1">
                {game.title}
              </h3>
              <p className="text-xs font-semibold text-amber-400/90 mb-3">
                {game.subtitle}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {game.description}
              </p>

              {/* Rewards Indicators */}
              <div className="flex items-center space-x-3 text-xs font-bold pt-2">
                <span className="text-amber-400">{game.points}</span>
                <span className="text-slate-600">•</span>
                <span className="text-purple-400">{game.xp}</span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => navigate(`/games/play/${game.id}?category=${encodeURIComponent(selectedCategory)}`)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
            >
              <span>Enter Game Arena</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
