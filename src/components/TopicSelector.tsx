import React, { useState, useEffect } from 'react';
import { Topic, Word } from '../types';
import { TOEICPhase } from '../data/toeicSkillData';
import { calculateTopicOverallProgress } from '../utils/topicProgress';
import { 
  FolderKanban, CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, 
  Search, X, Award, Flame, Filter, BookOpen, Headphones, Layers, Mic
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface TopicSelectorProps {
  topics: Topic[];
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  currentPhase: TOEICPhase;
  allWords: Word[];
  learnedWords: string[];
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  activeTopicId,
  onSelectTopic,
  currentPhase,
  allWords,
  learnedWords,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [progressUpdateKey, setProgressUpdateKey] = useState(0);

  useEffect(() => {
    const handleProgressUpdate = () => {
      setProgressUpdateKey((k) => k + 1);
    };
    window.addEventListener('topic-skill-updated', handleProgressUpdate);
    return () => window.removeEventListener('topic-skill-updated', handleProgressUpdate);
  }, []);

  // Filter topics belonging to current phase (15 topics per phase + special personal notebook)
  const phaseTopics = topics.filter((t) => {
    if (t.id === 'custom-personal-notebook') return true;
    if (currentPhase === 'foundation') return t.day <= 15;
    if (currentPhase === 'acceleration') return t.day >= 16 && t.day <= 30;
    return true;
  });

  const activeIndex = phaseTopics.findIndex((t) => t.id === activeTopicId);
  const activeTopic = phaseTopics[activeIndex >= 0 ? activeIndex : 0] || topics[0];

  // Helper stats: Calculate comprehensive 4-skill progress (each skill 25%, total 100%)
  const getTopicStats = (topic: Topic) => {
    const topicWords = allWords.filter((w) => w.topicId === topic.id || w.day === topic.day);
    const learnedCount = topicWords.filter((w) => learnedWords.includes(w.id)).length;
    const totalCount = topic.id === 'custom-personal-notebook' ? topicWords.length : (topicWords.length || topic.wordCount || 25);
    
    // Overall 4-skill calculation
    const overall = calculateTopicOverallProgress(topic.id);
    const overallPercent = overall.percent;
    const completedSkillsCount = overall.completedSkillsCount;
    const isMastered = overall.isAllCompleted;

    return { 
      learnedCount, 
      totalCount, 
      overallPercent, 
      completedSkillsCount, 
      isMastered, 
      skills: overall.skills 
    };
  };

  const activeStats = getTopicStats(activeTopic);

  const handlePrevTopic = () => {
    if (activeIndex > 0) {
      onSelectTopic(phaseTopics[activeIndex - 1].id);
      playSound('click');
    }
  };

  const handleNextTopic = () => {
    if (activeIndex < phaseTopics.length - 1) {
      onSelectTopic(phaseTopics[activeIndex + 1].id);
      playSound('click');
    }
  };

  const filteredTopics = phaseTopics.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.titleVi.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mb-4 space-y-2">
      {/* SLIM, COMPACT TOPIC HEADER BAR */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Topic Title & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#801732] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
            <FolderKanban className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {activeTopic.id === 'custom-personal-notebook' ? '⭐ Sổ Từ Cá Nhân' : `Chủ đề ${activeTopic.day} / ${phaseTopics.length}`}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {activeTopic.badge || 'TOEIC Core'}
              </span>
              
              {/* Accurate completion badge based on 4-skill progress */}
              {activeStats.isMastered ? (
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  ✓ Hoàn thành 4/4 Kỹ năng
                </span>
              ) : activeStats.completedSkillsCount > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Tiến độ: {activeStats.completedSkillsCount}/4 Kỹ năng ({activeStats.overallPercent}%)
                </span>
              ) : null}
            </div>

            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {activeTopic.titleVi}
              <span className="hidden md:inline font-normal text-xs text-slate-500 dark:text-slate-400 ml-2">
                ({activeTopic.title})
              </span>
            </h2>
          </div>
        </div>

        {/* Action Controls: Progress + Prev/Next + Expand Drawer */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
          {/* Progress Indicator */}
          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {activeStats.completedSkillsCount}/4 Kỹ năng (<strong className="text-[#801732] dark:text-rose-400">{activeStats.overallPercent}%</strong>)
            </span>
            <div className="w-24 sm:w-28 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-200 dark:border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#801732] to-rose-600 dark:from-rose-500 dark:to-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${activeStats.overallPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Prev / Next Topic Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevTopic}
              disabled={activeIndex <= 0}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700"
              title="Chủ đề trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextTopic}
              disabled={activeIndex >= phaseTopics.length - 1}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700"
              title="Chủ đề tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Drawer Button */}
          <button
            onClick={() => {
              setIsDrawerOpen(prev => !prev);
              playSound('click');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-all border border-slate-200 dark:border-slate-700"
          >
            <span>{isDrawerOpen ? 'Đóng' : 'Đổi chủ đề'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDrawerOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* DROPDOWN / DRAWER OF ALL 15 TOPICS */}
      {isDrawerOpen && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#801732]/20 dark:border-slate-700 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Chọn chủ đề (Giai đoạn {currentPhase === 'foundation' ? '1: Nền tảng' : '2: Tăng tốc'})
            </span>

            <div className="relative w-44 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Grid of Topic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = topic.id === activeTopic.id;
              const stats = getTopicStats(topic);

              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    setIsDrawerOpen(false);
                    playSound('click');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#801732]/5 dark:bg-brand-950/30 border-[#801732] ring-1 ring-[#801732]'
                      : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">
                        Chủ đề #{topic.day}
                      </span>
                      {/* Mini 4-skill dots */}
                      <div className="flex items-center gap-1">
                        <span 
                          className={`w-1.5 h-1.5 rounded-full ${stats.skills.vocab ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} 
                          title="Từ vựng"
                        />
                        <span 
                          className={`w-1.5 h-1.5 rounded-full ${stats.skills.listening ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`} 
                          title="Luyện nghe"
                        />
                        <span 
                          className={`w-1.5 h-1.5 rounded-full ${stats.skills.reading ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`} 
                          title="Luyện đọc"
                        />
                        <span 
                          className={`w-1.5 h-1.5 rounded-full ${stats.skills.speaking_writing ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'}`} 
                          title="Nói & Viết"
                        />
                      </div>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {topic.titleVi}
                    </h4>
                  </div>

                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex-shrink-0 ${
                    stats.isMastered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : stats.overallPercent > 0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {stats.overallPercent}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
