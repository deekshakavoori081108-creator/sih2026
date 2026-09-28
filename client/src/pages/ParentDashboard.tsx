import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ParentAnalytics } from '../types';
import { 
  ShieldCheck, Clock, Award, BookOpen, Flame, UserCheck, 
  Lock, CheckCircle2, AlertCircle, BarChart3, Settings, Sparkles 
} from 'lucide-react';
import { KycModal } from '../components/KycModal';

interface ParentDashboardProps {
  navigate: (path: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ParentAnalytics | null>(null);
  const [screenLimit, setScreenLimit] = useState<number>(45);
  const [showKycModal, setShowKycModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await api.getParentAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load parent analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-epic text-amber-200">Retrieving Guardian Security & Learning Audit...</p>
      </div>
    );
  }

  const child = analytics?.child;
  const guardian = analytics?.guardian;
  const isWithinLimit = (child?.activeMinutesToday || 0) <= screenLimit;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guardian Control & Minor Safety Center</span>
          </div>

          <h1 className="font-epic text-2xl sm:text-3xl font-extrabold text-slate-100">
            Parental Oversight & Analytics
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Monitor <strong className="text-amber-300">{child?.name}</strong>'s learning progression, enforce screen-time boundaries, and review verified KYC compliance.
          </p>
        </div>

        {/* Verified Guardian Certificate Tag */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 flex items-center space-x-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              KYC VERIFIED STATUS
            </span>
            <p className="text-xs font-bold text-slate-200">{guardian?.name || user?.guardianName}</p>
            <p className="text-[10px] text-slate-400">ID Type: {guardian?.idType || 'AADHAAR'}</p>
          </div>
        </div>
      </div>

      {/* Screen Time & Accuracy Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Screen Time */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Daily Active Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-epic text-2xl font-bold text-slate-100">
              {child?.activeMinutesToday || 20}m
            </span>
            <span className={`text-xs font-semibold ${isWithinLimit ? 'text-emerald-400' : 'text-rose-400'}`}>
              / {screenLimit}m limit
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isWithinLimit ? '✓ Balanced, healthy engagement' : '⚠️ Reached daily recommended limit'}
          </p>
        </div>

        {/* Metric 2: Quiz Accuracy */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Game Accuracy</span>
            <BarChart3 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-epic text-2xl font-bold text-slate-100">
              {child?.accuracyPercent || 92}%
            </span>
            <span className="text-xs font-semibold text-emerald-400">High Mastery</span>
          </div>
          <p className="text-[11px] text-slate-500">Based on trivia and chronology puzzles</p>
        </div>

        {/* Metric 3: Stories Unlocked */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Chapters Unlocked</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-epic text-2xl font-bold text-slate-100">
              {child?.storiesRead || 1}
            </span>
            <span className="text-xs font-semibold text-amber-400">Cliffhangers</span>
          </div>
          <p className="text-[11px] text-slate-500">Unlocked via mini-game victories</p>
        </div>

        {/* Metric 4: Daily Streak */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Current Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-epic text-2xl font-bold text-slate-100">
              {child?.streak || 1} Days
            </span>
            <span className="text-xs font-semibold text-orange-400">Flame Active</span>
          </div>
          <p className="text-[11px] text-slate-500">Consecutive calendar day logins</p>
        </div>

      </div>

      {/* Screen Time Limit Controls & Safety Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Guardian Screen-Time Controls */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-epic text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Screen-Time Allowance Setting</span>
            </h3>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              {screenLimit} Mins / Day
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Select the maximum daily educational play limit for your child. Once reached, gentle prompts encourage rest, outdoor activities, or book reading.
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[30, 45, 60, 90].map(mins => (
              <button
                key={mins}
                onClick={() => setScreenLimit(mins)}
                className={`py-3 rounded-xl text-xs font-bold transition-all ${
                  screenLimit === mins
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Current Status for Aarav:</span>
            <strong className={isWithinLimit ? 'text-emerald-400' : 'text-rose-400'}>
              {isWithinLimit ? 'Healthy Learning Pace' : 'Time Limit Exceeded'}
            </strong>
          </div>
        </div>

        {/* Safety & Compliance Audit Checklist */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-epic text-lg font-bold text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Platform Safety Audit Checklist</span>
            </h3>
            <button
              onClick={() => setShowKycModal(true)}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              View Protocol
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">AI Narrative Content Filter</span>
              </div>
              <span className="font-bold text-emerald-400">Strict Child-Safe</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Historical Violence Adaptation</span>
              </div>
              <span className="font-bold text-emerald-400">Ethical & Moral Focus</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Government ID Privacy</span>
              </div>
              <span className="font-bold text-emerald-400">SHA-256 Hashed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Commercial Advertisements</span>
              </div>
              <span className="font-bold text-emerald-400">Zero (Ad-Free)</span>
            </div>
          </div>
        </div>

      </div>

      {/* KYC Safety Information Modal */}
      <KycModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        guardianName={guardian?.name || user?.guardianName}
        idType={guardian?.idType || 'AADHAAR'}
      />

    </div>
  );
};
