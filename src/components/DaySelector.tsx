import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Filter } from 'lucide-react';
import { Word } from '../types';
import { TOEICPhase } from '../data/toeicSkillData';

interface DaySelectorProps {
  activeDay: number;
  onSelectDay: (day: number) => void;
  allWords: Word[];
  learnedWords: string[];
  currentPhase?: TOEICPhase;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  activeDay,
  onSelectDay,
  allWords,
  learnedWords,
  currentPhase = 'foundation',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAllDays, setShowAllDays] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  // Determine active day range based on current phase:
  // Phase 1 (Foundation): Days 1 to 15
  // Phase 2 (Acceleration): Days 16 to 30
  // Phase 3 (Mock Exam) or showAllDays: Days 1 to 30
  let days: number[] = [];
  if (showAllDays || currentPhase === 'mock_exam') {
    days = Array.from({ length: 30 }, (_, i) => i + 1);
  } else if (currentPhase === 'foundation') {
    days = Array.from({ length: 15 }, (_, i) => i + 1);
  } else if (currentPhase === 'acceleration') {
    days = Array.from({ length: 15 }, (_, i) => i + 16);
  }

  const phaseLabel = currentPhase === 'foundation'
    ? 'Lộ trình Giai đoạn 1: Ngày 1 - 15 (Nền tảng 450 - 600+)'
    : currentPhase === 'acceleration'
    ? 'Lộ trình Giai đoạn 2: Ngày 16 - 30 (Tăng tốc 650 - 800+)'
    : 'Lộ trình Toàn diện 30 ngày';

  return (
    <div className="py-2.5 px-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 shadow-xs mb-4">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
            currentPhase === 'foundation'
              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              : currentPhase === 'acceleration'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
          }`}>
            {currentPhase === 'foundation' ? 'GIAI ĐOẠN 1' : currentPhase === 'acceleration' ? 'GIAI ĐOẠN 2' : 'GIAI ĐOẠN 3'}
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {showAllDays ? 'Hiển thị tất cả 30 ngày' : phaseLabel}
          </span>
        </div>

        {/* Toggle between showing all 30 days vs showing phase-specific days */}
        {currentPhase !== 'mock_exam' && (
          <button
            onClick={() => setShowAllDays(prev => !prev)}
            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 active:scale-95 transition-all"
          >
            <Filter className="w-3 h-3" />
            <span>{showAllDays ? 'Thu gọn về Giai đoạn hiện tại' : 'Xem toàn bộ 30 ngày'}</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Left Scroll Arrow */}
        <button
          onClick={() => scroll('left')}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors hidden sm:block"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Day Pills */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 flex-1"
        >
          {days.map(day => {
            const dayWords = allWords.filter(w => w.day === day);
            const total = dayWords.length;
            const learned = dayWords.filter(w => learnedWords.includes(w.id)).length;
            const isCompleted = total > 0 && learned === total;
            const isActive = activeDay === day;

            return (
              <button
                key={day}
                onClick={() => onSelectDay(day)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <span>Ngày {day}</span>
                {total > 0 && (
                  <span
                    className={`inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : `${learned}/${total}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        <button
          onClick={() => scroll('right')}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors hidden sm:block"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
