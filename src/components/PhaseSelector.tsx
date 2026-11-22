import React from 'react';
import { TOEICPhase } from '../data/toeicSkillData';
import { 
  Target, Zap, Trophy, ChevronRight, Award, Compass, Sparkles, 
  BookOpen, Headphones, Layers, Mic, PenTool, CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';

interface PhaseSelectorProps {
  currentPhase: TOEICPhase;
  onSelectPhase: (phase: TOEICPhase) => void;
  onNavigateToSkill?: (skillTab: 'vocab' | 'listening' | 'reading' | 'speaking' | 'writing' | 'exam') => void;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  currentPhase,
  onSelectPhase,
  onNavigateToSkill,
}) => {
  const phases: {
    id: TOEICPhase;
    badge: string;
    target: string;
    title: string;
    scope: string;
    desc: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      id: 'foundation',
      badge: 'GIAI ĐOẠN 1',
      target: 'Mục tiêu 450 - 600+',
      title: 'Nền Tảng & Phản Xạ Căn Bản',
      scope: 'Ngày 1 - 15 • 380+ từ vựng',
      desc: 'Phát âm chuẩn IPA, 12 chuyên đề ngữ pháp Part 5-6, bắt bẫy Part 1-2, miêu tả tranh Q1-4.',
      icon: Target,
      accentColor: 'from-blue-600 to-cyan-600',
    },
    {
      id: 'acceleration',
      badge: 'GIAI ĐOẠN 2',
      target: 'Mục tiêu 650 - 800+',
      title: 'Chiến Thuật & Tăng Tốc Kỹ Năng',
      scope: 'Ngày 16 - 30 • 263+ từ vựng',
      desc: 'Nghe hội thoại Part 3-4, đọc hiểu đoạn kép Part 7, trả lời phỏng vấn Q5-10, viết email Q6-7.',
      icon: Zap,
      accentColor: 'from-amber-600 to-orange-600',
    },
    {
      id: 'mock_exam',
      badge: 'GIAI ĐOẠN 3',
      target: 'Mục tiêu 850 - 990 / SW 350+',
      title: 'Thực Chiến Đề Thi Thật ETS',
      scope: 'Toàn bộ 30 ngày • 200 câu ETS',
      desc: 'Full Test 200 câu bấm giờ 120 phút, mô phỏng phòng thi Speaking & Writing, phân tích lỗ hổng điểm.',
      icon: Trophy,
      accentColor: 'from-[#801732] to-[#540b1e]',
    },
  ];

  return (
    <div className="mb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Lộ trình học 4 kỹ năng chia theo 3 giai đoạn:
          </span>
        </div>
        <span className="text-xs text-brand-600 dark:text-brand-400 font-bold hidden sm:inline-block">
          Khuyến nghị: Hoàn thành theo tuần tự từ Giai đoạn 1 &rarr; 2 &rarr; 3
        </span>
      </div>

      {/* 3 Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {phases.map((ph) => {
          const Icon = ph.icon;
          const isActive = currentPhase === ph.id;

          return (
            <button
              key={ph.id}
              onClick={() => onSelectPhase(ph.id)}
              className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-brand-500 dark:border-brand-500 ring-2 ring-brand-500/25 shadow-md shadow-brand-900/10 scale-[1.01]'
                  : 'bg-white/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Active Accent Top Line */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 to-rose-600" />
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {ph.badge}
                  </span>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {ph.target}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white bg-gradient-to-br ${ph.accentColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {ph.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                      {ph.scope}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {ph.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
                <span className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}>
                  {isActive ? 'Đang học giai đoạn này' : 'Bấm để chuyển sang giai đoạn này'}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0.5 text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* DETAILED PHASE CURRICULUM SYLLABUS CARD */}
      {currentPhase === 'foundation' && (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 shadow-sm transition-all animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                GĐ 1
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    KHUNG CHƯƠNG TRÌNH GIAI ĐOẠN 1: NỀN TẢNG & PHẢN XẠ CĂN BẢN
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    TOEIC 450 - 600+
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Phạm vi: <strong>Ngày 1 &rarr; Ngày 15</strong> • 380+ Từ vựng công sở cốt lõi • Trọng tâm: <strong>Listening Part 1-2</strong>, <strong>Reading Part 5 (12 Ngữ pháp)</strong>, <strong>Speaking Q1-4 (IPA)</strong>, <strong>Writing Q1-5</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Lộ trình Từ vựng */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <BookOpen className="w-4 h-4" />
                  <span>1. Từ vựng Ngày 1 - 15</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold">
                  380+ từ
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                Từ vựng Văn phòng & Giao dịch
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Hợp đồng, Bảo hành, Hội nghị, Thiết bị IT, Thư tín, Tuyển dụng, Đãi ngộ, Thuế, Mua sắm, Giao vận, Kho bãi, Ngân hàng, Bất động sản.
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('vocab')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Học từ vựng Ngày 1-15</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 2. Trọng tâm Nghe */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Headphones className="w-4 h-4" />
                  <span>2. Nghe Part 1 & 2</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">
                  Trọng tâm GĐ 1
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                Bắt bẫy âm & Thì động từ
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Part 1: Phân biệt thì 'is/are V-ing' vs 'has been V3'. Part 2: Bắt từ để hỏi WH-, bẫy từ đồng âm lặp lại (echo word trap), bẫy trả lời Yes/No.
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('listening')}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Luyện Nghe Part 1 & 2</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 3. Trọng tâm Đọc */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Layers className="w-4 h-4" />
                  <span>3. Đọc hiểu Part 5</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 font-bold">
                  12 Ngữ pháp
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                12 Chuyên đề Ngữ pháp then chốt
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Quy tắc nhận diện từ loại (N/V/Adj/Adv), các thì quá khứ/hiện tại/tương lai, câu bị động, hòa hợp S-V, đại từ nhân xưng & sở hữu, giới từ.
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('reading')}
                  className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Luyện Ngữ pháp Part 5</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 4. Nói & Viết cơ bản */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                  <Mic className="w-4 h-4" />
                  <span>4. Nói Q1-4 & Viết Q1-5</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold">
                  Phát âm & Tranh
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                Chuẩn hóa IPA & Đặt câu theo tranh
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Speaking: Đọc to đoạn văn chuẩn trọng âm và nối âm (Q1-2), miêu tả tranh cơ bản (Q3-4). Writing: Viết 1 câu hoàn chỉnh chứa 2 từ cho sẵn (Q1-5).
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('speaking')}
                  className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Luyện Nói Q1-4</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {currentPhase === 'acceleration' && (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 shadow-sm transition-all animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                GĐ 2
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    KHUNG CHƯƠNG TRÌNH GIAI ĐOẠN 2: CHIẾN THUẬT & TĂNG TỐC KỸ NĂNG
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    TOEIC 650 - 800+
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Phạm vi: <strong>Ngày 16 &rarr; Ngày 30</strong> • 263+ Từ vựng nâng cao • Trọng tâm: <strong>Listening Part 3-4 (Bảng biểu/Ngụ ý)</strong>, <strong>Reading Part 6-7 (Đoạn kép & Paraphrase)</strong>, <strong>Speaking Q5-11 (Phỏng vấn)</strong>, <strong>Writing Q6-8 (Email & Essay)</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Lộ trình Từ vựng */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <BookOpen className="w-4 h-4" />
                  <span>1. Từ vựng Ngày 16 - 30</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 font-bold">
                  263+ từ B2-C1
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                Quản trị, Tiếp thị & Dịch vụ Quốc tế
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Hội đồng quản trị & R&D, Tiếp thị thị trường, Hàng không & Di chuyển công tác, Khách sạn, Y tế & Bảo hiểm, Nghệ thuật, Xuất bản & Truyền thông.
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('vocab')}
                  className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Học từ vựng Ngày 16-30</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 2. Trọng tâm Nghe */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <Headphones className="w-4 h-4" />
                  <span>2. Nghe Part 3 & 4</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 font-bold">
                  Trọng tâm GĐ 2
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                Hội thoại 3 người, Bảng biểu & Ngụ ý
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Kỹ thuật đọc lướt câu hỏi trong 8s nghỉ, bắt từ đồng nghĩa (paraphrase), câu hỏi suy luận ngụ ý người nói, câu hỏi tra cứu bản đồ / lịch trình.
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('listening')}
                  className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Luyện Nghe Part 3 & 4</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 3. Trọng tâm Đọc */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-4 h-4" />
                  <span>3. Đọc hiểu Part 6 & 7</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold">
                  Đoạn kép & Paraphrase
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                Đoạn kép / ba & Bảng đối chiếu đồng nghĩa
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Kỹ thuật Skimming (15s nắm ý) & Scanning (tìm ngày/giờ/giá), liên kết thông tin giữa 2-3 đoạn văn, giải câu hỏi chèn câu (sentence insertion).
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('reading')}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Luyện Đọc hiểu Part 6 & 7</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* 4. Nói & Viết nâng cao */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <PenTool className="w-4 h-4" />
                  <span>4. Nói Q5-11 & Viết Q6-8</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold">
                  Email & Essay
                </span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-100 font-bold mb-1">
                Phản xạ công sở & Viết email / bài luận
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                Speaking: Trả lời phỏng vấn nhanh (Q5-7), tra cứu lịch trình giải đáp thắc mắc (Q8-10), thuyết trình quan điểm (Q11). Writing: Viết email phản hồi (Q6-7) & Luận 300 từ (Q8).
              </p>
              {onNavigateToSkill && (
                <button
                  onClick={() => onNavigateToSkill('writing')}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Luyện Viết Email Q6-7</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {currentPhase === 'mock_exam' && (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-rose-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 shadow-sm transition-all animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-rose-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#801732] text-white flex items-center justify-center font-black shadow-md shadow-[#801732]/20">
                GĐ 3
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    KHUNG CHƯƠNG TRÌNH GIAI ĐOẠN 3: THỰC CHIẾN ĐỀ THI THẬT ETS
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-100 dark:bg-rose-950 text-[#801732] dark:text-rose-300">
                    Mục tiêu 850 - 990 / SW 350+
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Phạm vi: <strong>Toàn bộ 30 ngày</strong> • Luyện Full Test 200 câu 120 phút • Thi Mini Test 30 phút • Quy đổi điểm ETS & Biểu đồ Radar phát hiện lỗ hổng
                </p>
              </div>
            </div>

            {onNavigateToSkill && (
              <button
                onClick={() => onNavigateToSkill('exam')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#801732] to-[#540b1e] hover:from-[#661225] hover:to-[#420817] text-white text-xs font-bold shadow-md shadow-[#801732]/20 active:scale-95 flex items-center gap-2 self-start md:self-auto"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Vào Phòng Thi Bấm Giờ Ngay</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-[#801732] dark:text-rose-400 flex items-center gap-1.5 mb-1">
                <Trophy className="w-4 h-4" />
                <span>Full Test ETS 200 Câu</span>
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                100 câu Listening 45 phút + 100 câu Reading 75 phút, tính giờ áp lực thi thật.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Mô phỏng Speaking & Writing</span>
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Ghi âm câu trả lời trực tiếp và chấm điểm phát âm AI theo barem ETS 200 điểm.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                <Award className="w-4 h-4" />
                <span>Radar Lỗ Hổng Điểm Số</span>
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Chỉ ra ngay part nào bạn đang mất điểm nhiều nhất để tập trung ôn luyện bù lỗ hổng.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
