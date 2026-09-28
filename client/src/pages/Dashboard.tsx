import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StreakBanner } from '../components/StreakBanner';
import { StoryReader } from '../components/StoryReader';
import { UnlockedStory } from '../types';
import { 
  Gamepad2, BookOpen, Sparkles, Award, Coins, Flame, 
  ArrowRight, Shield, Rocket, CheckCircle2, ChevronRight, PlayCircle
} from 'lucide-react';

interface DashboardProps {
  navigate: (path: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState<UnlockedStory[]>([]);
  const [activeStoryToRead, setActiveStoryToRead] = useState<UnlockedStory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const fetchedStories = await api.getUnlockedStories();
        setStories(fetchedStories || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalLevels = user?.totalLevelsCompleted || 0;
  const levelsInCurrentCycle = totalLevels % 2;
  const levelsNeededForNextStory = 2 - levelsInCurrentCycle;
  const totalXp = user?.totalXp || 0;

  // Rank calculation based on XP
  let rankTitle = 'Novice Scribe';
  if (totalXp > 300) rankTitle = 'Ancient Sage';
  else if (totalXp > 150) rankTitle = 'Chrono Voyager';
  else if (totalXp > 75) rankTitle = 'Codex Seeker';

  const latestStory = stories.length > 0 ? stories[stories.length - 1] : null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              Active Focus: {user?.preferredCategory || 'Ramayana & Epics'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/40">
              Rank: {rankTitle}
            </span>
          </div>

          <h1 className="font-epic text-2xl sm:text-3xl font-extrabold text-slate-100">
            Greetings, {user?.childName || 'Explorer'}!
          </h1>

          <p className="text-xs sm:text-sm text-slate-400">
            Your sacred learning codex is active. Triumph in 2 mini-games to unlock your next suspenseful cliffhanger chapter!
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center min-w-[90px]">
            <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">COINS</span>
            <div className="flex items-center justify-center space-x-1 mt-0.5">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-epic font-bold text-lg text-amber-200">{user?.rewardPoints || 0}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center min-w-[90px]">
            <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">TOTAL XP</span>
            <div className="flex items-center justify-center space-x-1 mt-0.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="font-epic font-bold text-lg text-purple-200">{totalXp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Login Streak Banner */}
      <StreakBanner 
        streak={user?.currentStreak || 1} 
        rewardPoints={user?.rewardPoints || 0} 
      />

      {/* Story Unlock Progression Progress Bar (The 2-Level Milestone) */}
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              <h2 className="font-epic text-xl font-bold text-amber-200">
                Next Cliffhanger Story Unlock Progress
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300">
              {levelsInCurrentCycle === 0 
                ? '⭐ A new chapter is ready or unlocked! Complete 2 more mini-game levels to generate the subsequent cliffhanger.'
                : `⚡ You completed ${levelsInCurrentCycle} of 2 required levels. Win 1 more mini-game challenge to unlock Chapter ${stories.length + 1}!`}
            </p>

            {/* Visual Step Bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 mt-2">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 transition-all duration-500"
                style={{ width: `${(levelsInCurrentCycle / 2) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1">
              <span>Current Level: {totalLevels} completed</span>
              <span className="text-amber-300 font-bold">{levelsInCurrentCycle} / 2 Levels to Chapter Unlock</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/games')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shrink-0"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Play Next Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Latest Unlocked Story & Daily Quests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Latest Unlocked Story Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-epic text-xl font-bold text-slate-100 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Latest Unlocked Story Chapter</span>
            </h3>

            <button
              onClick={() => navigate('/library')}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>View All Chapters ({stories.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestStory ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    {latestStory.topic} • Chapter {latestStory.chapter_number}
                  </span>
                  <h4 className="font-epic text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                    {latestStory.title}
                  </h4>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
                  📖
                </div>
              </div>

              {/* Preview Content */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {latestStory.content}
              </p>

              {/* Cliffhanger Spotlight Tag */}
              <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                  Suspenseful Cliffhanger:
                </span>
                <p className="text-xs text-orange-200 font-semibold italic">
                  "{latestStory.cliffhanger_prompt}"
                </p>
              </div>

              {/* Read Action Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Audio narration & choices enabled</span>

                <button
                  onClick={() => setActiveStoryToRead(latestStory)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-md shadow-amber-500/20 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Read Chapter & Listen</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center glass-panel rounded-3xl space-y-3">
              <p className="text-slate-400 text-sm">No stories unlocked yet.</p>
              <button
                onClick={() => navigate('/games')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Play Games to Unlock Chapter 1
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Daily Quests & Arcade Launchers */}
        <div className="space-y-6">
          
          {/* Daily Quests Box */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-epic text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Daily Quests</span>
              </h3>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Reset in 12h
              </span>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Conquer 1 History Quiz', pts: '+50 Pts', done: totalLevels >= 1 },
                { title: 'Harmonize an Artifact Timeline', pts: '+80 Pts', done: totalLevels >= 2 },
                { title: 'Decipher a Sacred Lexicon', pts: '+60 Pts', done: totalLevels >= 3 }
              ].map((quest, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      quest.done ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-600'
                    }`}>
                      ✓
                    </div>
                    <span className={quest.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {quest.title}
                    </span>
                  </div>
                  <span className="font-bold text-amber-400">{quest.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launch Games */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="font-epic text-sm font-bold text-slate-300 uppercase tracking-wider">
              Quick Arcade Access
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => navigate('/games/play/TRIVIA')}
                className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⚔️</span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-100 group-hover:text-amber-300">Trivia Conquest</h5>
                    <p className="text-[10px] text-slate-400">Power-ups & Speed Bonuses</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </button>

              <button
                onClick={() => navigate('/games/play/PUZZLE')}
                className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🏺</span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-100 group-hover:text-amber-300">Artifact Puzzle</h5>
                    <p className="text-[10px] text-slate-400">Arrange Chrono Milestones</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </button>

              <button
                onClick={() => navigate('/games/play/WORD_CRYPT')}
                className="w-full p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-left flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔠</span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-100 group-hover:text-amber-300">Word Crypt</h5>
                    <p className="text-[10px] text-slate-400">Decipher Ancient Glyphs</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </button>
            </div>
          </div>

          {/* Premium Vault Promo Card */}
          <div 
            onClick={() => navigate('/vault/premium')}
            className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40 hover:border-purple-400 transition-all space-y-2.5"
          >
            <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Rocket className="w-4 h-4 text-purple-400" />
              <span>Premium Learning Vault</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Exchange your points for Chandrayaan-3 lunar science, Child Safety laws, and DIY Physics experiments!
            </p>
            <span className="text-[11px] font-bold text-purple-400 flex items-center space-x-1">
              <span>Explore Vault Store</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

        </div>

      </div>

      {/* Story Reader Modal */}
      {activeStoryToRead && (
        <StoryReader
          story={activeStoryToRead}
          onClose={() => setActiveStoryToRead(null)}
          onPlayNextGame={() => {
            setActiveStoryToRead(null);
            navigate('/games');
          }}
        />
      )}

    </div>
  );
};
