import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
  guardianName?: string;
  idType?: string;
}

export const KycModal: React.FC<KycModalProps> = ({ isOpen, onClose, guardianName, idType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-epic text-xl font-bold text-slate-100">
              Parent & Guardian KYC Protocol
            </h3>
            <p className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Identity Verification Standard for Minor Safety</span>
            </p>
          </div>
        </div>

        {/* Explanatory Body */}
        <div className="space-y-4 text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Strict Cryptographic Privacy Architecture</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Katha Yatra complies with international child safety standards. We do not store raw government identification numbers. All ID numbers are converted into cryptographic SHA-256 hashes with one-way salting.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Why We Require Guardian Verification:
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Child Protection from Screen Abuse:</strong> Enforces parent-managed screen limits and authentic age verification.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Zero Commercial Ad Retargeting:</strong> No third-party data broker sharing, trackers, or commercial ads.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>AI Safety Filtering:</strong> All dynamic historical content is supervised through strict ethical non-violence guidelines.</span>
              </li>
            </ul>
          </div>

          {guardianName && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Verified Guardian: <strong className="text-slate-200">{guardianName}</strong></span>
              <span>ID Type: <strong className="text-amber-400">{idType || 'AADHAAR'}</strong></span>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-md"
          >
            I Understand & Confirm Safety
          </button>
        </div>

      </div>
    </div>
  );
};
