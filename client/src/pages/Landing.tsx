import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, ShieldCheck, Flame, BookOpen, Gamepad2, Award, 
  ArrowRight, CheckCircle2, Star, Users, Brain, Rocket, Lock
} from 'lucide-react';

interface LandingProps {
  navigate: (path: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ navigate }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-24 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 text-center">
        {/* Glow ambient effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-orange-600/10 to-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transforming Screen-Time Into Civilizational Wisdom</span>
          </div>

          <h1 className="font-epic text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-100">
            Journey Into The Heart Of <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-500 bg-clip-text text-transparent">
              Ancient Epics & Science
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Replace mindless video feeds with active, gamified cultural learning. Solve interactive mini-games, maintain daily streaks, and unlock captivating serialized stories that leave you hanging on thrilling cliffhangers.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter Student Command Center</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth/register-kyc')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-950" />
                  <span>Start Journey • Guardian KYC</span>
                </button>

                <button
                  onClick={() => navigate('/auth/login')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-slate-800/80 font-bold text-base transition-all border border-slate-700/80"
                >
                  Sign In to Existing Account
                </button>
              </>
            )}
          </div>

          {/* Safety & Compliance Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-400">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Parent/Guardian KYC Gated</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>Gemini AI Cliffhanger Engine</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Zero Ads & Cryptographic Hashing</span>
            </span>
          </div>

        </div>
      </section>

      {/* Gamification Progression Loop (2-Level Rule) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            The Katha Progression Loop
          </span>
          <h2 className="font-epic text-3xl sm:text-4xl font-bold text-slate-100">
            How The Adventure Unfolds
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every 2 completed mini-game levels unlocks a new dynamic story chapter tailored to your learning choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-epic font-bold text-2xl">
              1
            </div>
            <h3 className="font-epic text-xl font-bold text-slate-100">
              Triumph in Mini-Games
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Test your wits in <strong>Trivia Conquest</strong>, reorder ancient chronologies in <strong>Artifact Puzzle</strong>, and decipher sacred terms in <strong>Word Crypt</strong>.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-amber-400 font-semibold">
              <Gamepad2 className="w-4 h-4" />
              <span>Earn XP, Coins & Streaks</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel-gold p-8 rounded-3xl border border-amber-500/40 shadow-xl shadow-amber-500/10 space-y-4 relative">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold border border-orange-500/40">
              CORE MECHANIC
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-epic font-bold text-2xl">
              2
            </div>
            <h3 className="font-epic text-xl font-bold text-amber-200">
              Unlock Cliffhanger Chapters
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every 2 levels completed unlocks a new serialized chapter powered by Gemini AI. Each chapter ends on a <strong>dramatic cliffhanger twist</strong> that fuels the drive to keep learning!
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-orange-300 font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>Audio Narration & Strategy Choices</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-epic font-bold text-2xl">
              3
            </div>
            <h3 className="font-epic text-xl font-bold text-slate-100">
              Unlock Premium Vault
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Spend accumulated reward points to open high-level educational vaults: <strong>Space Missions</strong> (Chandrayaan & Apollo), <strong>Real-Life Child Rights & Laws</strong>, and <strong>DIY Science Labs</strong>.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-purple-400 font-semibold">
              <Rocket className="w-4 h-4" />
              <span>Badges & Real-World Knowledge</span>
            </div>
          </div>

        </div>
      </section>

      {/* Target Focus Domains Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Rich Taxonomy
              </span>
              <h2 className="font-epic text-3xl font-bold text-slate-100 mt-1">
                Explore World Civilizations & Sacred Epics
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              From the cosmic wisdom of the Bhagavad Gita to the hydraulic engineering of Harappa and the lunar craters of Chandrayaan-3.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '🏹', title: 'Ramayana & Epics', tag: 'Dharma & Courage' },
              { icon: '🏺', title: 'Indus Valley', tag: '3300 BCE Citadel' },
              { icon: '🏛️', title: 'Ancient Egypt', tag: 'Pyramids & Nile' },
              { icon: '⚔️', title: 'Greco-Roman', tag: 'Philosophy & Laws' },
              { icon: '🚀', title: 'Space Missions', tag: 'ISRO & NASA' },
              { icon: '🔬', title: 'DIY Science', tag: 'Optics & Physics' }
            ].map((topic, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2 hover:border-amber-500/40 transition-all">
                <span className="text-3xl block">{topic.icon}</span>
                <h4 className="font-bold text-xs text-slate-200">{topic.title}</h4>
                <p className="text-[10px] text-amber-400/90 font-medium">{topic.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Safety & KYC Verification Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Built For Responsible Guardians
            </span>
            <h2 className="font-epic text-3xl sm:text-4xl font-bold text-slate-100">
              Total Transparency & Verified Child Safety
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We understand parental concerns about unsupervised screen-time and algorithmic rabbit holes. Katha Yatra was engineered with strict age-gates, daily learning limits, and guardian supervision.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Identity-Verified Guardian KYC</h4>
                  <p className="text-xs text-slate-400">Aadhaar, Passport, or National ID hash verification prevents unmonitored minor account creation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Parental Analytics Dashboard</h4>
                  <p className="text-xs text-slate-400">Track active minutes, quiz accuracy, streak counts, and topics explored in real-time.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Non-Violent Ethical Adaptation</h4>
                  <p className="text-xs text-slate-400">All historical conflicts are adapted to focus on moral dilemmas, strategic intellect, and civilizational resilience.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/auth/register-kyc')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Create Guardian-Verified Profile
              </button>
            </div>
          </div>

          {/* Interactive Preview Mockup */}
          <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-400 fill-orange-500" />
                <span className="font-epic text-sm font-bold text-amber-200">KATHA YATRA LIVE HUD</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                GUARDIAN KYC VERIFIED
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Chapter:</span>
                <span className="text-amber-300 font-bold">Ramayana & Epics • Chapter 1</span>
              </div>
              <p className="text-xs text-slate-200 font-medium italic">
                "...the golden deer looked directly into Rama's eyes and whispered an ancient riddle in clear human speech!"
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-orange-400 font-bold">
                <span>⚠️ Cliffhanger Twist Locked!</span>
                <span>Play 2 Levels to Unlock Ch. 2</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">DAILY STREAK</span>
                <span className="text-lg font-bold text-orange-400 font-epic">5 Days 🔥</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">REWARD POINTS</span>
                <span className="text-lg font-bold text-amber-400 font-epic">340 Pts 🪙</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 pt-12 pb-8 text-center text-xs text-slate-500 space-y-3">
        <p className="font-epic text-sm text-slate-400">
          Katha Yatra — The Sacred Journey of Stories, Wisdom & Science
        </p>
        <p>Built with pride for youth education, civilizational heritage, and responsible digital engagement.</p>
        <p className="text-[10px] text-slate-600">Compliant with COPPA & Guardian Verification Protocols • Powered by Google Gemini AI</p>
      </footer>

    </div>
  );
};
