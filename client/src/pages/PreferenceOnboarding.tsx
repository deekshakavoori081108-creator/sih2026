import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CategorySelector } from '../components/CategorySelector';
import { Sparkles, ArrowRight, Compass, CheckCircle2 } from 'lucide-react';

interface PreferenceOnboardingProps {
  navigate: (path: string) => void;
}

export const PreferenceOnboarding: React.FC<PreferenceOnboardingProps> = ({ navigate }) => {
  const { user, refreshProfile } = useAuth();
  const [selectedPrimary, setSelectedPrimary] = useState<string>(
    user?.preferredCategory || 'Ramayana & Epics'
  );
  const [secondaryCategories, setSecondaryCategories] = useState<string[]>(
    user?.secondaryCategories || ['Indus Valley Civilization', 'Space Exploration']
  );
  const [saving, setSaving] = useState(false);

  const toggleSecondary = (catName: string) => {
    setSecondaryCategories(prev =>
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.savePreferences({
        preferredCategory: selectedPrimary,
        secondaryCategories
      });
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save preferences:', err);
      // fallback navigate
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          <span>Curating Your Child's Journey</span>
        </div>

        <h1 className="font-epic text-3xl sm:text-4xl font-extrabold text-slate-100">
          Choose Your Cultural & Civilizational Focus
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Welcome, <strong className="text-amber-300">{user?.childName || 'Young Explorer'}</strong>! Select the primary epic or era you wish to journey through first. Your mini-games and serialized cliffhanger stories will adapt to this path.
        </p>
      </div>

      {/* Category Grid */}
      <CategorySelector
        selectedCategory={selectedPrimary}
        onSelect={(catName) => setSelectedPrimary(catName)}
        showMultiSelectSecondary={true}
        secondarySelected={secondaryCategories}
        onToggleSecondary={toggleSecondary}
      />

      {/* Selected Summary Card */}
      <div className="p-6 rounded-2xl glass-panel-gold border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xl">
            ✨
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400">
              Active Primary Path Selected:
            </h4>
            <p className="font-epic text-lg font-bold text-slate-100">{selectedPrimary}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
        >
          {saving ? (
            <span>Preparing Your Codex...</span>
          ) : (
            <>
              <span>Lock Path & Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
