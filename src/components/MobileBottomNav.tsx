import React from 'react';
import { BookOpen, BookmarkCheck, Trophy, User, Sparkles, Flame } from 'lucide-react';
import { playSound } from '../utils/audio';

export type MobileTab = 'study' | 'notebook' | 'exam' | 'profile';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  notebookBadgeCount: number;
  streak: number;
  currentPhaseTag?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  notebookBadgeCount,
  streak,
  currentPhaseTag = 'GD 1',
}) => {
  const tabs = [
    {
      id: 'study' as MobileTab,
      label: 'Học Tập',
      icon: BookOpen,
      sub: currentPhaseTag,
    },
    {
      id: 'notebook' as MobileTab,
      label: 'Sổ Từ',
      icon: BookmarkCheck,
      badge: notebookBadgeCount > 0 ? notebookBadgeCount : undefined,
    },
    {
      id: 'exam' as MobileTab,
      label: 'Thi Thử',
      icon: Trophy,
      badge: 'ETS',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'profile' as MobileTab,
      label: 'Hồ Sơ',
      icon: User,
      badge: `${streak}d`,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  return (
    <nav 
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/92 dark:bg-slate-900/92 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-colors"
    >
      <div className="flex items-center justify-around h-15 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onSelectTab(tab.id);
                playSound('click');
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative transition-all duration-200 active:scale-95 touch-manipulation ${
                isActive
                  ? 'text-[#801732] dark:text-rose-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active Tab Glow Pill */}
              <div
                className={`relative p-1 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#801732]/10 dark:bg-rose-500/20 scale-110'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-105 stroke-[2.5]' : 'stroke-2'}`} />

                {/* Optional Badge */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-2 px-1.5 py-0.2 min-w-4 text-[9px] font-black rounded-full text-center leading-tight shadow-xs ${
                      tab.badgeColor || 'bg-[#801732] text-white dark:bg-rose-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] tracking-tight mt-0.5 leading-none ${isActive ? 'font-black' : 'font-medium'}`}>
                {tab.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#801732] dark:bg-rose-400 mt-1 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
