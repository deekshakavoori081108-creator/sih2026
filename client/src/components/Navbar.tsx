import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Coins, ShieldCheck, BookOpen, Gamepad2, Sparkles, UserCheck, LogOut, Compass } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-2xl">📜</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-epic text-2xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-orange-200 to-amber-400 bg-clip-text text-transparent">
                KATHA YATRA
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-amber-500/80 font-medium">The Journey of Stories</p>
          </div>
        </div>

        {/* Navigation Links for Authenticated Users */}
        {user ? (
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                currentPath === '/dashboard' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Command Center</span>
            </button>

            <button
              onClick={() => navigate('/library')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                currentPath === '/library' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Codex & Stories</span>
            </button>

            <button
              onClick={() => navigate('/games')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                currentPath.startsWith('/games') 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-blue-400" />
              <span>Arcade Hub</span>
            </button>

            <button
              onClick={() => navigate('/vault/premium')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                currentPath === '/vault/premium' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Premium Vault</span>
            </button>

            <button
              onClick={() => navigate('/parent/dashboard')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                currentPath === '/parent/dashboard' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Parent Center</span>
            </button>
          </nav>
        ) : null}

        {/* Right Side Stats & Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Streak Badge */}
              <div 
                title="Daily Login Streak! Play games to keep your streak glowing." 
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-300 shadow-sm"
              >
                <Flame className="w-4 h-4 text-orange-400 fill-orange-500 flame-active" />
                <span className="font-bold text-sm">{user.currentStreak || 1}d</span>
              </div>

              {/* Reward Points Counter */}
              <div 
                title="Reward Points! Spend these in the Premium Vault to unlock Space Missions & Science Experiments."
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 shadow-sm"
              >
                <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-sm">{user.rewardPoints || 0}</span>
              </div>

              {/* KYC Status Badge */}
              <div 
                title="Guardian KYC Verified for Child Safety"
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>KYC Safe</span>
              </div>

              {/* User Dropdown / Logout */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-slate-200">{user.childName}</p>
                  <p className="text-[10px] text-slate-400">Guardian: {user.guardianName}</p>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/auth/login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth/register-kyc')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.02]"
              >
                Guardian KYC Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
