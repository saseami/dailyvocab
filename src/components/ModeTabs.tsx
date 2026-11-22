import React, { useState } from 'react';
import { LearningMode } from '../types';
import { BookOpen, Layers, HelpCircle, Headphones, Zap, Mic, PenTool, Sparkles, Brain } from 'lucide-react';
import { MemoryGuideModal } from './MemoryGuideModal';

interface ModeTabsProps {
  activeMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  wordCount: number;
}

export const ModeTabs: React.FC<ModeTabsProps> = ({
  activeMode,
  onSelectMode,
  wordCount,
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Scientifically ordered 7-step pedagogical curriculum:
  // 1. Input (Nạp từ) -> 2. Active Recall (Flashcard) -> 3. Phonological Loop (Nghe & Viết)
  // -> 4. Fast Association (Nối từ) -> 5. Testing (Trắc nghiệm)
  // -> 6. Spoken Output (Speaking Lab) -> 7. Written Production (Writing Studio)
  const modes: {
    id: LearningMode;
    step: string;
    label: string;
    icon: React.FC<{ className?: string }>;
    countBadge?: number;
    highlight?: boolean;
  }[] = [
    { id: 'learn', step: 'Bước 1', label: '1. Nạp từ', icon: BookOpen, countBadge: wordCount },
    { id: 'flashcard', step: 'Bước 2', label: '2. Flashcard 3D & SRS', icon: Layers },
    { id: 'spelling', step: 'Bước 3', label: '3. Nghe & Viết', icon: Headphones },
    { id: 'match', step: 'Bước 4', label: '4. Nối từ phản xạ', icon: Zap },
    { id: 'quiz', step: 'Bước 5', label: '5. Trắc nghiệm TOEIC', icon: HelpCircle },
    { id: 'speaking', step: 'Bước 6', label: '6. Luyện Nói AI', icon: Mic, highlight: true },
    { id: 'writing', step: 'Bước 7', label: '7. Luyện Viết TOEIC', icon: PenTool, highlight: true },
  ];

  return (
    <div>
      {/* Top Banner with Guide Trigger */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <span>Lộ trình học chuẩn khoa học:</span>
        </span>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-brand-50 to-indigo-50 hover:from-brand-100 hover:to-indigo-100 dark:from-slate-800 dark:to-indigo-950/50 border border-brand-200/80 dark:border-indigo-800 text-brand-700 dark:text-brand-300 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Brain className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
          <span>Hướng dẫn 7 bước ghi nhớ vĩnh viễn (Ebbinghaus)</span>
        </button>
      </div>

      {/* Tabs Container */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
        {modes.map(mode => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : mode.highlight
                  ? 'text-indigo-600 dark:text-indigo-400 hover:bg-white/50 dark:hover:bg-slate-900/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : mode.highlight ? 'text-indigo-500' : 'text-slate-400'}`} />
              <span>{mode.label}</span>
              {mode.countBadge !== undefined && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                  {mode.countBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 7-Step Memory Guide Modal */}
      <MemoryGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectStep={(mode) => onSelectMode(mode)}
      />
    </div>
  );
};
