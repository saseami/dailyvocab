import React, { useState } from 'react';
import { TOEICPhase } from '../data/toeicSkillData';
import { Target, Zap, Trophy, ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audio';

interface PhaseNavigationProps {
  currentPhase: TOEICPhase;
  onSelectPhase: (phase: TOEICPhase) => void;
  phase1CompletedCount: number;
  phase1TotalCount: number;
  phase2CompletedCount: number;
  phase2TotalCount: number;
}

export const PhaseNavigation: React.FC<PhaseNavigationProps> = ({
  currentPhase,
  onSelectPhase,
  phase1CompletedCount,
  phase1TotalCount,
  phase2CompletedCount,
  phase2TotalCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const phase1Percent = phase1TotalCount > 0 ? Math.round((phase1CompletedCount / phase1TotalCount) * 100) : 0;
  const phase2Percent = phase2TotalCount > 0 ? Math.round((phase2CompletedCount / phase2TotalCount) * 100) : 0;

  const phases: {
    id: TOEICPhase;
    shortLabel: string;
    target: string;
    tag: string;
    icon: React.FC<{ className?: string }>;
    desc: string;
    progressText: string;
  }[] = [
    {
      id: 'foundation',
      shortLabel: 'Giai Đoạn 1',
      target: 'Mục Tiêu 450 - 600+',
      tag: 'NỀN TẢNG',
      icon: Target,
      desc: '15 Chủ đề công sở thiết yếu, 12 chuyên đề ngữ pháp Part 5 & bắt bẫy Part 1-2',
      progressText: `${phase1CompletedCount}/${phase1TotalCount} từ (${phase1Percent}%)`,
    },
    {
      id: 'acceleration',
      shortLabel: 'Giai Đoạn 2',
      target: 'Mục Tiêu 650 - 800+',
      tag: 'TĂNG TỐC',
      icon: Zap,
      desc: '15 Chủ đề nâng cao, đọc hiểu văn bản kép Part 6-7, nghe hội thoại Part 3-4 & viết email',
      progressText: `${phase2CompletedCount}/${phase2TotalCount} từ (${phase2Percent}%)`,
    },
    {
      id: 'mock_exam',
      shortLabel: 'Giai Đoạn 3',
      target: 'Mục Tiêu 850 - 990',
      tag: 'THỰC CHIẾN ETS',
      icon: Trophy,
      desc: 'Đề thi thật 200 câu LR bấm giờ 120 phút & mô phỏng phòng thi Speaking/Writing chuẩn ETS',
      progressText: 'Full Test & Barem ETS',
    },
  ];

  const currentPhaseData = phases.find((p) => p.id === currentPhase) || phases[0];

  return (
    <div className="mb-4">
      {/* COMPACT SEGMENTED BAR (Thu nhỏ gọn gàng, tiết kiệm không gian màn hình) */}
      <div className="p-1 sm:p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2">
        {/* Segmented Phase Switcher Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 overflow-x-auto scrollbar-none">
          {phases.map((p) => {
            const Icon = p.icon;
            const isActive = currentPhase === p.id;

            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPhase(p.id);
                  playSound('click');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#801732] text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.shortLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold hidden sm:inline-block ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {p.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Phase Summary & Toggle Details */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs">
          <span className="hidden md:inline-block text-slate-500 font-medium">
            {currentPhaseData.target} • <strong className="text-[#801732] dark:text-rose-400">{currentPhaseData.progressText}</strong>
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={isExpanded ? 'Thu gọn chi tiết giai đoạn' : 'Xem chi tiết mục tiêu giai đoạn'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* OPTIONAL EXPANDED DETAIL DRAWER */}
      {isExpanded && (
        <div className="mt-2.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {phases.map((p) => {
              const Icon = p.icon;
              const isActive = currentPhase === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPhase(p.id);
                    setIsExpanded(false);
                    playSound('click');
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#801732]/5 dark:bg-brand-950/20 border-[#801732] ring-1 ring-[#801732]'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#801732]' : 'text-slate-500'}`} />
                    <span className="text-xs font-black">{p.shortLabel}: {p.target}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
