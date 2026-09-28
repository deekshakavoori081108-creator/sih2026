import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StoryReader } from '../components/StoryReader';
import { UnlockedStory } from '../types';
import { 
  BookOpen, Sparkles, Lock, PlayCircle, Filter, 
  ArrowRight, Award, Compass, BrainCircuit, RefreshCw 
} from 'lucide-react';
import { CATEGORY_OPTIONS } from '../components/CategorySelector';

interface LibraryProps {
  navigate: (path: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState<UnlockedStory[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [activeStoryToRead, setActiveStoryToRead] = useState<UnlockedStory | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await api.getUnlockedStories();
      setStories(data || []);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleGenerateNextChapter = async (topic: string) => {
    setGenerating(true);
    setStatusMessage(null);
    try {
      const topicStories = stories.filter(s => s.topic === topic);
      const nextChapterNumber = topicStories.length + 1;
      
      const newChapter = await api.generateNextChapter(
        topic,
        nextChapterNumber,
        topicStories.length > 0 ? topicStories[topicStories.length - 1].content.slice(0, 200) : undefined
      );

      setStatusMessage(`✨ Chapter ${nextChapterNumber} crafted by Katha AI!`);
      await fetchStories();
      if (newChapter) {
        setActiveStoryToRead(newChapter);
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to generate chapter. Play mini-games to unlock!');
    } finally {
      setGenerating(false);
    }
  };

  const filteredStories = selectedTopic === 'All'
    ? stories
    : stories.filter(s => s.topic === selectedTopic);

  const topicsList = ['All', ...Array.from(new Set(CATEGORY_OPTIONS.map(c => c.name)))];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cultural & History Codex</span>
          </div>

          <h1 className="font-epic text-3xl sm:text-4xl font-extrabold text-slate-100">
            The Library of Whispering Scrolls
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Browse all unlocked serialized story chapters. Listen with authentic narration, examine cultural takeaways, and face suspenseful cliffhanger twists.
          </p>
        </div>

        {/* AI Generator CTA */}
        <div className="glass-panel-gold p-4 rounded-2xl border border-amber-500/40 flex items-center space-x-3 shrink-0">
          <BrainCircuit className="w-8 h-8 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
              Gemini AI Story Engine
            </span>
            <button
              onClick={() => handleGenerateNextChapter(user?.preferredCategory || 'Ramayana & Epics')}
              disabled={generating}
              className="text-xs font-bold text-slate-100 hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <span>{generating ? 'Summoning Chapter...' : 'Generate Next Chapter Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Message Alert */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-amber-400 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Topic Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {topicsList.map(topic => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedTopic === topic
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'glass-panel text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-epic text-amber-200">Retrieving Sacred Manuscripts...</p>
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => (
            <div
              key={story.id}
              className="glass-panel-gold rounded-3xl p-6 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Chapter {story.chapter_number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-semibold border border-slate-800">
                    3 min read • Audio Enabled
                  </span>
                </div>

                <h3 className="font-epic text-xl font-bold text-slate-100 leading-snug">
                  {story.title}
                </h3>

                <p className="text-xs text-amber-400/90 font-semibold">
                  {story.topic}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                  {story.content}
                </p>

                {/* Cliffhanger snippet */}
                <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                    Cliffhanger Ending:
                  </span>
                  <p className="text-xs text-orange-200 italic line-clamp-2">
                    "{story.cliffhanger_prompt}"
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Unlocked</span>

                <button
                  onClick={() => setActiveStoryToRead(story)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Read Chapter</span>
                </button>
              </div>
            </div>
          ))}

          {/* Locked Next Chapter Teaser Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4 opacity-75 hover:opacity-100 transition-opacity">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Chapter {filteredStories.length + 1}
                </span>
                <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] font-semibold border border-slate-800">
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>LOCKED CLIFFHANGER</span>
                </span>
              </div>

              <h3 className="font-epic text-xl font-bold text-slate-400">
                The Next Revelation Awaits...
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                Play 2 mini-game levels in the Arcade Hub to trigger the continuation of this epic arc.
              </p>
            </div>

            <button
              onClick={() => navigate('/games')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-700"
            >
              <span>Play Games to Unlock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-3xl">
            📜
          </div>
          <h3 className="font-epic text-xl font-bold text-slate-100">
            No Stories Found In This Category Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Play mini-games to unlock chapters or generate the first chapter of this saga using Katha AI!
          </p>
          <div className="pt-2 flex items-center justify-center space-x-3">
            <button
              onClick={() => navigate('/games')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Play Mini-Games
            </button>
          </div>
        </div>
      )}

      {/* Story Reader Modal */}
      {activeStoryToRead && (
        <StoryReader
          story={activeStoryToRead}
          onClose={() => setActiveStoryToRead(null)}
          onPlayNextGame={() => {
            setActiveStoryToRead(null);
            navigate('/games');
          }}
        />
      )}

    </div>
  );
};
