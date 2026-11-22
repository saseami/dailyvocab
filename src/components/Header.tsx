import React from 'react';
import { Flame, Sparkles, BookOpen, CheckCircle2, Moon, Sun, Monitor, Plus, BarChart2 } from 'lucide-react';

interface HeaderProps {
  streak: number;
  learnedCount: number;
  masteredCount: number;
  totalCount: number;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onOpenAddWord: () => void;
  onOpenStats: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  learnedCount,
  masteredCount,
  totalCount,
  theme,
  onThemeChange,
  onOpenAddWord,
  onOpenStats,
}) => {
  const isDarkMode = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs pt-safe w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-13 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-[#9f3750] dark:from-brand-600 dark:to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-900/20 flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse-subtle" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-brand-600 via-[#9f3750] to-[#540b1e] dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                DailyVocab
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                TOEIC 4-Skills
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
              Hệ thống luyện thi TOEIC trọng tâm theo chủ đề &amp; 4 kỹ năng
            </p>
          </div>
        </div>

        {/* Stats Chips */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Streak Badge */}
          <div 
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm font-bold shadow-xs"
            title={`Chuỗi học liên tiếp: ${streak} ngày`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{streak}d</span>
          </div>

          {/* Words Learned */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
            title="Số từ đã học / Tổng số từ"
          >
            <BookOpen className="w-4 h-4 text-brand-500" />
            <span>{learnedCount}/{totalCount} từ</span>
          </div>

          {/* Mastered Words */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs sm:text-sm font-semibold"
            title="Từ đã thuộc lòng (Mastered)"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{masteredCount} đã thuộc</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Add Word Button */}
          <button
            onClick={onOpenAddWord}
            className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
            title="Thêm từ vựng mới"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm từ</span>
          </button>

          {/* Stats Button (Desktop only; on mobile it's available in Hồ Sơ tab) */}
          <button
            onClick={onOpenStats}
            className="hidden sm:flex p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Thống kê học tập & Sao lưu"
            aria-label="Thống kê"
          >
            <BarChart2 className="w-5 h-5" />
          </button>

          {/* Theme Toggle Button (Icon only on mobile, text on desktop) */}
          <button
            onClick={() => onThemeChange(isDarkMode ? 'light' : 'dark')}
            className={`flex items-center justify-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all text-xs font-bold shadow-xs ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-indigo-300 hover:border-indigo-500'
                : 'bg-white border-[#e6c8ce] text-brand-600 hover:border-[#be7685] shadow-brand-900/5'
            }`}
            title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            aria-label="Đổi giao diện Sáng / Tối"
          >
            {isDarkMode ? (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-brand-600" />
                <span className="hidden sm:inline">Light</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
