import React from 'react';
import { Flame, Shield, Award, Sparkles } from 'lucide-react';

interface StreakBannerProps {
  streak: number;
  rewardPoints: number;
}

export const StreakBanner: React.FC<StreakBannerProps> = ({ streak, rewardPoints }) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon
  const normalizedIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 glass-panel-gold border border-amber-500/30 shadow-xl">
      {/* Decorative background glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Streak Information */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex flex-col items-center justify-center">
              <Flame className="w-8 h-8 text-orange-400 fill-orange-500 flame-active" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-epic text-2xl font-bold text-amber-200">
                {streak} Day Learning Streak!
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40">
                ACTIVE
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">
              {streak >= 3 
                ? 'Your sacred lamp of curiosity burns bright! Daily bonus multiplier active.'
                : 'Log in daily and conquer challenges to unlock legendary epic cliffhangers!'}
            </p>
          </div>
        </div>

        {/* Center: Weekly Flame Dots */}
        <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx <= normalizedIndex;
            const isToday = idx === normalizedIndex;

            return (
              <div key={day} className="flex flex-col items-center space-y-1">
                <div 
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isToday
                      ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 ring-2 ring-amber-400/50 scale-110 shadow-md shadow-orange-500/30'
                      : isCompleted
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-slate-800/40 border border-slate-700/50 text-slate-500'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${isCompleted ? 'fill-current' : 'opacity-40'}`} />
                </div>
                <span className="text-[10px] font-medium text-slate-400">{day}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Streak Freeze & Bonus Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Streak Freeze: Guarded</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>+25 pts / day</span>
          </div>
        </div>

      </div>
    </div>
  );
};
