import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Lock, Mail, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { KycModal } from '../components/KycModal';

interface KycRegisterProps {
  navigate: (path: string) => void;
}

export const KycRegister: React.FC<KycRegisterProps> = ({ navigate }) => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    guardianName: '',
    guardianIdType: 'AADHAAR' as 'AADHAAR' | 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE',
    guardianIdNumber: '',
    guardianPhone: '',
    childName: '',
    childAge: 10,
    gradeLevel: 'Grade 5',
    agreeSafety: true
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showKycInfoModal, setShowKycInfoModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreeSafety) {
      setError('Please acknowledge the Child Safety & Content Advisory declaration.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        guardianName: formData.guardianName,
        guardianIdType: formData.guardianIdType,
        guardianIdNumber: formData.guardianIdNumber,
        guardianPhone: formData.guardianPhone,
        childName: formData.childName,
        childAge: Number(formData.childAge),
        gradeLevel: formData.gradeLevel
      });
      // Navigate to preference selector onboarding
      navigate('/onboarding/preferences');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-10 border border-amber-500/40 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Age-Gated Minor Safety Protocol</span>
          </div>

          <h2 className="font-epic text-2xl sm:text-3xl font-bold text-slate-100">
            Guardian KYC & Child Onboarding
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            To prevent unmonitored screen time and safeguard minors, Katha Yatra requires identity-verified guardian authentication.
          </p>

          <button
            type="button"
            onClick={() => setShowKycInfoModal(true)}
            className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-semibold underline mt-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How we protect your Government ID data with SHA-256</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/70 flex items-center space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Multi-section Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Guardian KYC Credentials */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <h3 className="font-epic text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>1. Guardian / Parent Verification Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guardian Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="e.g., Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Government ID Document Type *
                </label>
                <select
                  value={formData.guardianIdType}
                  onChange={(e: any) => setFormData({ ...formData, guardianIdType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                >
                  <option value="AADHAAR">Aadhaar Card (India)</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="NATIONAL_ID">National ID / Citizen Card</option>
                  <option value="DRIVERS_LICENSE">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Government ID Number / Last 4 Digits *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianIdNumber}
                  onChange={(e) => setFormData({ ...formData, guardianIdNumber: e.target.value })}
                  placeholder="e.g. 5892 4810 9234"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">One-way hashed via SHA-256 for privacy</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guardian Mobile Contact (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Account Login Credentials */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <h3 className="font-epic text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>2. Account Access Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Family / Account Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="family@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Master Password (min 8 chars) *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Child Learner Profile */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <h3 className="font-epic text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <span>🎒</span>
              <span>3. Student Learner Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Child's Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  placeholder="e.g., Aarav or Ananya"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Child's Age (5 - 18) *
                </label>
                <input
                  type="number"
                  min={5}
                  max={18}
                  required
                  value={formData.childAge}
                  onChange={(e) => setFormData({ ...formData, childAge: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Grade / Class Level
                </label>
                <input
                  type="text"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  placeholder="e.g. Grade 5"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Child Safety Acknowledgment */}
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <input
              type="checkbox"
              id="safetyCheck"
              checked={formData.agreeSafety}
              onChange={(e) => setFormData({ ...formData, agreeSafety: e.target.checked })}
              className="w-4 h-4 mt-1 accent-amber-500 rounded cursor-pointer"
            />
            <label htmlFor="safetyCheck" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
              I am the parent/legal guardian of this child. I authorize their enrollment in Katha Yatra's non-commercial cultural gamification platform and confirm understanding of the strict safety filtering protocols.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying KYC & Creating Account...</span>
              </span>
            ) : (
              <>
                <span>Complete KYC & Select Cultural Focus</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Existing account link */}
        <div className="text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <button
            onClick={() => navigate('/auth/login')}
            className="text-amber-400 font-bold hover:underline"
          >
            Sign in to existing account
          </button>
        </div>

      </div>

      {/* KYC Safety Information Modal */}
      <KycModal
        isOpen={showKycInfoModal}
        onClose={() => setShowKycInfoModal(false)}
        guardianName={formData.guardianName || 'Guardian'}
        idType={formData.guardianIdType}
      />
    </div>
  );
};
