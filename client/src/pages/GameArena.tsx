import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { TriviaEngine } from '../components/games/TriviaEngine';
import { ArtifactPuzzleEngine } from '../components/games/ArtifactPuzzleEngine';
import { WordCryptEngine } from '../components/games/WordCryptEngine';
import { StoryReader } from '../components/StoryReader';
import { UnlockedStory } from '../types';
import confetti from 'canvas-confetti';
import { Award, Sparkles, BookOpen, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

interface GameArenaProps {
  gameId: string;
  categoryParam?: string;
  navigate: (path: string) => void;
}

export const GameArena: React.FC<GameArenaProps> = ({ gameId, categoryParam, navigate }) => {
  const { user, updateUserPoints, refreshProfile } = useAuth();
  const category = categoryParam || user?.preferredCategory || 'Ramayana & Epics';

  const [completedResult, setCompletedResult] = useState<{
    earnedPoints: number;
    earnedXp: number;
    storyUnlocked: boolean;
    unlockedChapter?: any;
    newLevelsCompleted: number;
  } | null>(null);

  const [activeStoryToRead, setActiveStoryToRead] = useState<UnlockedStory | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleLevelComplete = async (score: number, timeSpentSeconds: number) => {
    setSubmitting(true);
    try {
      const res = await api.completeLevel({
        category,
        gameType: gameId.toUpperCase(),
        score,
        timeSpentSeconds
      });

      updateUserPoints(res.totalRewardPoints, res.currentStreak);
      await refreshProfile();

      setCompletedResult({
        earnedPoints: res.earnedPoints,
        earnedXp: res.earnedXp,
        storyUnlocked: Boolean(res.storyUnlocked),
        unlockedChapter: res.unlockedChapter,
        newLevelsCompleted: res.newLevelsCompleted
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (err) {
      console.error('Failed to submit level completion:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenUnlockedStory = () => {
    if (completedResult?.unlockedChapter) {
      const ch = completedResult.unlockedChapter;
      setActiveStoryToRead({
        id: ch.id,
        topic: ch.topic,
        chapter_number: ch.chapterNumber,
        title: ch.title,
        content: ch.content || 'A suspenseful new chapter awaits your keen gaze in the library codex...',
        cliffhanger_prompt: ch.cliffhanger || 'The adventure leaves off on a dramatic suspenseful twist!',
        culturalContext: 'Explore how wisdom and perseverance overcome challenges.',
        interactiveChoices: ['Investigate the anomaly', 'Consult ancient records']
      });
    } else {
      navigate('/library');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Submitting Loading Overlay */}
      {submitting && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
          <div className="glass-panel-gold p-6 rounded-2xl flex items-center space-x-3 text-amber-300 font-epic">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Harmonizing Progression & Checking Story Unlocks...</span>
          </div>
        </div>
      )}

      {/* Level Completion / Story Unlocked Modal */}
      {completedResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className={`max-w-md w-full rounded-3xl p-6 sm:p-8 border shadow-2xl text-center space-y-6 ${
            completedResult.storyUnlocked
              ? 'glass-panel-gold border-amber-400 ring-2 ring-amber-400/40'
              : 'glass-panel border-slate-700 bg-slate-900/90'
          }`}>
            
            {/* Header Icon */}
            <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl bg-gradient-to-tr from-amber-500 to-orange-500">
              {completedResult.storyUnlocked ? '📜' : '🏆'}
            </div>

            {/* Title */}
            <div>
              {completedResult.storyUnlocked ? (
                <>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
                    MILESTONE ACHIEVED • 2 LEVELS COMPLETED!
                  </span>
                  <h3 className="font-epic text-2xl sm:text-3xl font-bold text-amber-200">
                    New Story Chapter Unlocked!
                  </h3>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                    CHALLENGE CONQUERED!
                  </span>
                  <h3 className="font-epic text-2xl font-bold text-slate-100">
                    Victory in {category}!
                  </h3>
                </>
              )}
            </div>

            {/* Unlocked Chapter Preview if available */}
            {completedResult.storyUnlocked && completedResult.unlockedChapter && (
              <div className="p-4 rounded-2xl bg-orange-950/50 border border-orange-500/40 text-left space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Chapter {completedResult.unlockedChapter.chapterNumber}:
                </span>
                <h4 className="font-epic font-bold text-sm text-slate-100">
                  {completedResult.unlockedChapter.title}
                </h4>
                <p className="text-xs text-orange-200 italic line-clamp-2">
                  "{completedResult.unlockedChapter.cliffhanger}"
                </p>
              </div>
            )}

            {/* Score & XP Rewards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">POINTS EARNED</span>
                <span className="font-epic font-bold text-lg text-amber-400">
                  +{completedResult.earnedPoints} Pts 🪙
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">XP GAINED</span>
                <span className="font-epic font-bold text-lg text-purple-400">
                  +{completedResult.earnedXp} XP ⚡
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {completedResult.storyUnlocked ? (
                <button
                  onClick={handleOpenUnlockedStory}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transition-all transform hover:scale-105"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Unlocked Cliffhanger Chapter</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCompletedResult(null);
                    navigate('/games');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <span>Play Another Game (1 Level to Story Unlock!)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Return to Command Center
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Active Game Engine Renderer */}
      {gameId.toUpperCase() === 'TRIVIA' && (
        <TriviaEngine
          category={category}
          onLevelComplete={handleLevelComplete}
          onExit={() => navigate('/games')}
        />
      )}

      {gameId.toUpperCase() === 'PUZZLE' && (
        <ArtifactPuzzleEngine
          category={category}
          onLevelComplete={handleLevelComplete}
          onExit={() => navigate('/games')}
        />
      )}

      {gameId.toUpperCase() === 'WORD_CRYPT' && (
        <WordCryptEngine
          category={category}
          onLevelComplete={handleLevelComplete}
          onExit={() => navigate('/games')}
        />
      )}

      {/* Story Reader Modal */}
      {activeStoryToRead && (
        <StoryReader
          story={activeStoryToRead}
          onClose={() => {
            setActiveStoryToRead(null);
            navigate('/library');
          }}
          onPlayNextGame={() => {
            setActiveStoryToRead(null);
            navigate('/games');
          }}
        />
      )}

    </div>
  );
};
