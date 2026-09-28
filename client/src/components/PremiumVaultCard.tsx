import React from 'react';
import { VaultModule } from '../types';
import { Lock, Unlock, Award, Coins, ArrowRight, Sparkles } from 'lucide-react';

interface PremiumVaultCardProps {
  module: VaultModule;
  userPoints: number;
  onUnlock: (mod: VaultModule) => void;
  onRead: (mod: VaultModule) => void;
}

export const PremiumVaultCard: React.FC<PremiumVaultCardProps> = ({
  module,
  userPoints,
  onUnlock,
  onRead
}) => {
  const isUnlocked = Boolean(module.isUnlocked);
  const canAfford = userPoints >= module.pointsCost;

  return (
    <div className={`relative rounded-3xl p-6 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between ${
      isUnlocked
        ? 'glass-panel-gold border-amber-500/50 shadow-xl shadow-amber-500/10'
        : 'glass-panel border-slate-800 hover:border-slate-700 bg-slate-900/50'
    }`}>
      
      <div>
        {/* Top Bar: Icon, Category & Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
            {module.icon}
          </div>

          <div className="flex flex-col items-end space-y-1">
            {isUnlocked ? (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                <Unlock className="w-3.5 h-3.5" />
                <span>UNLOCKED</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-xs font-semibold border border-slate-700">
                <Lock className="w-3.5 h-3.5" />
                <span>LOCKED VAULT</span>
              </span>
            )}

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {module.type}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-epic text-xl font-bold text-slate-100 mb-1 leading-snug">
          {module.title}
        </h3>
        <p className="text-xs text-amber-400/90 font-medium mb-3">
          {module.subtitle}
        </p>

        {/* Summary Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {module.summary}
        </p>

        {/* Badge Awarded on Unlock */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center space-x-2.5 mb-4">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400">Badge Earned: </span>
            <strong className="text-slate-200 font-bold">{module.badgeAwarded}</strong>
          </div>
        </div>

        {/* Learning Outcomes List */}
        <div className="space-y-1.5 mb-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Key Discoveries:
          </p>
          {module.learningOutcomes.slice(0, 2).map((outcome, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
              <span className="text-amber-400 font-bold">•</span>
              <span className="line-clamp-2">{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        {isUnlocked ? (
          <button
            onClick={() => onRead(module)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            <span>Open Interactive Codex</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-sm">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{module.pointsCost} Pts</span>
            </div>

            <button
              onClick={() => onUnlock(module)}
              disabled={!canAfford}
              className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                canAfford
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{canAfford ? 'Unlock Module' : 'Need More Points'}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
