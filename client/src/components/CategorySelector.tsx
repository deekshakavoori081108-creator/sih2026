import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export interface CategoryOption {
  id: string;
  name: string;
  categoryGroup: 'Sacred Epics' | 'Ancient Civilizations' | 'STEM & Modern';
  icon: string;
  gradient: string;
  tagline: string;
  description: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'ramayana',
    name: 'Ramayana & Epics',
    categoryGroup: 'Sacred Epics',
    icon: '🏹',
    gradient: 'from-amber-600/30 to-orange-700/20 border-amber-500/40',
    tagline: 'Treta Yuga • Dharma & Devotion',
    description: 'Walk alongside Rama, Lakshmana, and Hanuman as they build the bridge of floating stones and uphold cosmic righteousness.'
  },
  {
    id: 'indus_valley',
    name: 'Indus Valley Civilization',
    categoryGroup: 'Ancient Civilizations',
    icon: '🏺',
    gradient: 'from-emerald-600/30 to-teal-700/20 border-emerald-500/40',
    tagline: 'Harappa & Mohenjo-daro • 3300 BCE',
    description: 'Explore standardized brick citadels, sophisticated underground drainage, and the tidal docks of Lothal.'
  },
  {
    id: 'ancient_egypt',
    name: 'Ancient Egypt & Mesopotamia',
    categoryGroup: 'Ancient Civilizations',
    icon: '🏛️',
    gradient: 'from-yellow-600/30 to-amber-800/20 border-yellow-500/40',
    tagline: 'Nile & Euphrates • Hieroglyphs & Laws',
    description: 'Decipher the Rosetta stone, climb monumental step pyramids, and read the 282 statutes of Hammurabi.'
  },
  {
    id: 'greco_roman',
    name: 'Greco-Roman History',
    categoryGroup: 'Ancient Civilizations',
    icon: '⚔️',
    gradient: 'from-blue-600/30 to-indigo-700/20 border-blue-500/40',
    tagline: 'Athens & Rome • Philosophy & Arches',
    description: 'Study the dialogues of Socrates, Roman hydraulic concrete aqueducts, and ancient democratic assemblies.'
  },
  {
    id: 'space_missions',
    name: 'Space Exploration',
    categoryGroup: 'STEM & Modern',
    icon: '🚀',
    gradient: 'from-purple-600/30 to-indigo-800/20 border-purple-500/40',
    tagline: 'ISRO & NASA • Lunar & Mars Orbiters',
    description: 'Follow Chandrayaan-3 to the Lunar South Pole, launch James Webb into deep space, and calculate orbital slingshots.'
  },
  {
    id: 'buddhist_jataka',
    name: 'Buddhist Jataka Tales',
    categoryGroup: 'Sacred Epics',
    icon: '☸️',
    gradient: 'from-cyan-600/30 to-sky-800/20 border-cyan-500/40',
    tagline: 'Wisdom & Kindness • Moral Parables',
    description: 'Timeless parables of courage, mindfulness, animal fables of empathy, and the pursuit of enlightenment.'
  }
];

interface CategorySelectorProps {
  selectedCategory: string;
  onSelect: (categoryName: string) => void;
  showMultiSelectSecondary?: boolean;
  secondarySelected?: string[];
  onToggleSecondary?: (categoryName: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelect,
  showMultiSelectSecondary = false,
  secondarySelected = [],
  onToggleSecondary
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORY_OPTIONS.map((cat) => {
          const isPrimary = selectedCategory === cat.name;
          const isSecondary = secondarySelected.includes(cat.name);

          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.name)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 transform hover:-translate-y-1 ${
                isPrimary
                  ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/50'
                  : 'glass-panel hover:border-slate-600 bg-slate-900/40'
              }`}
            >
              {/* Category Badge & Icon */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-2xl shadow-inner">
                  {cat.icon}
                </div>

                <div className="flex items-center space-x-1.5">
                  {isPrimary && (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Primary Focus</span>
                    </span>
                  )}

                  {showMultiSelectSecondary && !isPrimary && onToggleSecondary && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSecondary(cat.name);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        isSecondary
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSecondary ? '✓ Exploring' : '+ Add to Path'}
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-epic text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs font-semibold text-amber-400/90 tracking-wide mt-0.5">
                {cat.tagline}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {cat.description}
              </p>

              {/* Category Group Pill */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{cat.categoryGroup}</span>
                <span className="flex items-center space-x-1 text-amber-500/80">
                  <Sparkles className="w-3 h-3" />
                  <span>Serialized Chapters</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
