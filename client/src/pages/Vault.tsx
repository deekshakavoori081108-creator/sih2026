import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VaultModule } from '../types';
import { PremiumVaultCard } from '../components/PremiumVaultCard';
import confetti from 'canvas-confetti';
import { 
  Rocket, Scale, Microscope, Coins, Award, Sparkles, 
  CheckCircle2, X, ArrowRight, ShieldCheck 
} from 'lucide-react';

interface VaultProps {
  navigate: (path: string) => void;
}

export const Vault: React.FC<VaultProps> = ({ navigate }) => {
  const { user, updateUserPoints, refreshProfile } = useAuth();
  const [modules, setModules] = useState<VaultModule[]>([]);
  const [userPoints, setUserPoints] = useState<number>(user?.rewardPoints || 0);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SPACE' | 'LAWS' | 'SCIENCE'>('ALL');
  const [readingModule, setReadingModule] = useState<VaultModule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await api.getVaultModules();
      setModules(data.modules || []);
      setUserPoints(data.userPoints ?? user?.rewardPoints ?? 0);
    } catch (err) {
      console.error('Failed to load vault modules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleUnlock = async (mod: VaultModule) => {
    try {
      const res = await api.unlockVaultModule({
        moduleId: mod.id,
        moduleType: mod.type,
        moduleTitle: mod.title,
        pointsCost: mod.pointsCost
      });

      setUserPoints(res.newPointsBalance);
      updateUserPoints(res.newPointsBalance);
      await refreshProfile();
      await fetchModules();

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      setFeedbackMsg(`🎉 Unlocked "${mod.title}"! Badge awarded: ${mod.badgeAwarded}`);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Failed to unlock module');
    }
  };

  const filteredModules = activeFilter === 'ALL'
    ? modules
    : modules.filter(m => m.type === activeFilter);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Learning Vault & Reward Store</span>
          </div>

          <h1 className="font-epic text-2xl sm:text-3xl font-extrabold text-slate-100">
            Expand Your Horizon Into Modern Milestones
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Spend the reward points you accumulated from mini-games to unlock masterclass modules on <strong>Space Missions</strong>, <strong>Real-Life Child Rights & Laws</strong>, and <strong>Hands-on Science Labs</strong>.
          </p>
        </div>

        {/* Current Point Balance Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/40 text-center min-w-[160px] shadow-lg">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            AVAILABLE REWARD POINTS
          </span>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <Coins className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
            <span className="font-epic font-bold text-3xl text-amber-200">{userPoints}</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Earn +50 to +80 in games</span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-amber-400 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'ALL', label: 'All Modules' },
          { id: 'SPACE', label: '🚀 Space Missions (ISRO/NASA)' },
          { id: 'LAWS', label: '⚖️ Real-Life Laws & Child Rights' },
          { id: 'SCIENCE', label: '🔬 Hands-on Science Labs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'glass-panel text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-epic text-amber-200">Opening Vault Seals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(mod => (
            <PremiumVaultCard
              key={mod.id}
              module={mod}
              userPoints={userPoints}
              onUnlock={handleUnlock}
              onRead={(m) => setReadingModule(m)}
            />
          ))}
        </div>
      )}

      {/* Full Module Interactive Reader Modal */}
      {readingModule && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass-panel-gold rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-amber-500/20 bg-slate-950/80 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{readingModule.icon}</span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    {readingModule.type} MODULE • BADGE: {readingModule.badgeAwarded}
                  </span>
                  <h3 className="font-epic text-xl sm:text-2xl font-bold text-slate-100">
                    {readingModule.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setReadingModule(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 parchment-bg text-slate-200">
              
              {/* Outcomes Callout */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Key Learnings in This Vault:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {readingModule.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sections */}
              {readingModule.sections.map((sec, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
                  <h4 className="font-epic text-lg font-bold text-amber-200">
                    {sec.heading}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {sec.content}
                  </p>

                  {sec.interactiveFact && (
                    <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-purple-300">Mind-Blowing Fact: </strong>
                        <span>{sec.interactiveFact}</span>
                      </div>
                    </div>
                  )}

                  {sec.diyActivity && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-emerald-300">Hands-on Lab Activity: </strong>
                        <span>{sec.diyActivity}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-amber-500/20 bg-slate-950/80 flex justify-end">
              <button
                onClick={() => setReadingModule(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
              >
                Close Codex
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
