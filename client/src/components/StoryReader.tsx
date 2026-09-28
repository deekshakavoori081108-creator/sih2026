import React, { useState, useEffect } from 'react';
import { UnlockedStory } from '../types';
import { Volume2, VolumeX, BookOpen, AlertTriangle, Sparkles, X, ArrowRight, Share2, Compass } from 'lucide-react';

interface StoryReaderProps {
  story: UnlockedStory;
  onClose: () => void;
  onPlayNextGame: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, onClose, onPlayNextGame }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudioNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${story.title}. Chapter ${story.chapter_number}. ${story.content}. Cliffhanger: ${story.cliffhanger_prompt}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass-panel-gold rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden">
        
        {/* Top Sticky Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/20 bg-slate-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                {story.topic} • Chapter {story.chapter_number}
              </span>
              <h2 className="font-epic text-xl sm:text-2xl font-bold text-slate-100">
                {story.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Audio Narration Toggle */}
            <button
              onClick={toggleAudioNarration}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isPlayingAudio ? 'Pause Narration' : 'Narrate Story'}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Story Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-200 parchment-bg">
          
          {/* Main Narrative Text */}
          <div className="space-y-4 font-sans text-base sm:text-lg leading-relaxed text-slate-200">
            {story.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="first-letter:font-epic first-letter:text-3xl first-letter:font-bold first-letter:text-amber-300 first-letter:mr-1">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Educational / Cultural Takeaway Box */}
          {story.culturalContext && (
            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Civilizational & Moral Takeaway:</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                {story.culturalContext}
              </p>
            </div>
          )}

          {/* CLIFFHANGER TWIST ENDING BOX */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-950/80 via-red-950/50 to-slate-950 border-2 border-orange-500/60 shadow-xl shadow-orange-500/10 space-y-3">
            <div className="flex items-center space-x-2 text-orange-400 font-epic font-bold text-sm tracking-wide">
              <AlertTriangle className="w-5 h-5 text-orange-400 animate-bounce" />
              <span>THE CLIFFHANGER TWIST!</span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-orange-100 leading-relaxed italic">
              "{story.cliffhanger_prompt}"
            </p>

            <div className="pt-2 text-xs font-bold text-amber-300 flex items-center space-x-2">
              <span>⚔️ What happens next is locked until you triumph in 2 more mini-game challenges!</span>
            </div>
          </div>

          {/* Interactive Choices */}
          {story.interactiveChoices && story.interactiveChoices.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>How Should The Journey Proceed? (Reader's Strategic Choice):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {story.interactiveChoices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedChoice(i)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedChoice === i
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                        : 'glass-panel hover:border-slate-600 bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <span>{choice}</span>
                    {selectedChoice === i && (
                      <span className="block mt-1 text-[10px] text-amber-400 font-bold">✓ Strategy Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-amber-500/20 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors"
          >
            Close & Return to Codex
          </button>

          <button
            onClick={onPlayNextGame}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transform hover:scale-[1.02] transition-all"
          >
            <span>Play Mini-Games to Unlock Next Chapter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
