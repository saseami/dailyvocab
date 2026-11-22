import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles, Trophy } from 'lucide-react';
import { getAchievements, AchievementBadge } from '../utils/achievements';
import { playSound } from '../utils/audio';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose }) => {
  const [badges, setBadges] = useState<AchievementBadge[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBadges(getAchievements());
      playSound('click');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Bảng Huy Hiệu Thành Tựu
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {unlockedCount} / {badges.length} Đã mở
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Các cột mốc khẳng định sự tiến bộ vượt bậc của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid: 8 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                b.isUnlocked
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                b.isUnlocked
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 grayscale'
              }`}>
                {b.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {b.title}
                  </h4>
                  {b.isUnlocked ? (
                    <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đạt</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                      <Lock className="w-3 h-3" />
                      <span>Khóa</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-tight">
                  {b.description}
                </p>

                <div className="mt-1 text-[10px] text-slate-400 font-mono">
                  {b.isUnlocked ? (
                    <span className="text-amber-700 dark:text-amber-400 font-bold">✓ Mở khóa thành công</span>
                  ) : (
                    <span>Tiêu chí: {b.progressText}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
