import React, { useRef } from 'react';
import { X, Award, Download, Share2, Printer, CheckCircle2, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ScoreCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateAvatar?: string;
  testTitle: string;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  targetScore: number;
  accuracyPercent: number;
}

export const ScoreCertificateModal: React.FC<ScoreCertificateModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  candidateAvatar = '🦁',
  testTitle,
  listeningScore,
  readingScore,
  totalScore,
  targetScore,
  accuracyPercent,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const testDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const certNumber = `VN-ETS-2026-${Math.abs(totalScore * 713).toString().substring(0, 6)}`;

  let cefrLevel = 'A1 (Sơ Cấp)';
  if (totalScore >= 850) cefrLevel = 'C1 (Advanced Professional)';
  else if (totalScore >= 700) cefrLevel = 'B2 (Upper Intermediate)';
  else if (totalScore >= 500) cefrLevel = 'B1 (Intermediate)';
  else if (totalScore >= 300) cefrLevel = 'A2 (Elementary)';

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto print:p-0 print:bg-white">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Phiếu Báo Điểm ETS TOEIC® Mô Phỏng</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all text-xs flex items-center gap-1 font-bold"
              title="In / Lưu PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* OFFICIAL CERTIFICATE CARD */}
        <div 
          ref={certificateRef}
          className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#fffefc] to-[#fbf7ee] text-slate-900 border-4 border-amber-600/60 shadow-xl space-y-5 print:border-2"
        >
          {/* Ornate Inner Border */}
          <div className="absolute inset-1.5 border border-dashed border-amber-700/30 rounded-2xl pointer-events-none" />

          {/* Header Seal & Organization */}
          <div className="text-center space-y-1 relative">
            <div className="flex items-center justify-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-widest">
              <span>★</span>
              <span>DAILYVOCAB OFFICIAL SCORE ASSESSMENT</span>
              <span>★</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              TOEIC® LISTENING &amp; READING SCORE REPORT
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              CERTIFICATE NUMBER: {certNumber} • FORM 2026-ETS
            </p>
          </div>

          {/* Candidate Info Row */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/80 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-2xl flex items-center justify-center flex-shrink-0 shadow-xs">
                {candidateAvatar}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  CANDIDATE NAME / THÍ SINH:
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
                  {candidateName}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Đề thi: {testTitle} • Ngày: {testDate}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ĐỘ CHÍNH XÁC:
              </span>
              <span className="text-lg font-black text-emerald-700 font-mono">
                {accuracyPercent}%
              </span>
            </div>
          </div>

          {/* Big Score Breakdown Box */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* Listening */}
            <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                🎧 LISTENING
              </span>
              <span className="text-2xl sm:text-3xl font-black text-rose-800 font-mono">
                {listeningScore}
              </span>
              <span className="text-[10px] text-slate-400 block">/ 495</span>
            </div>

            {/* Reading */}
            <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                📚 READING
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
                {readingScore}
              </span>
              <span className="text-[10px] text-slate-400 block">/ 495</span>
            </div>

            {/* TOTAL SCORE */}
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 block mb-0.5">
                🏆 TOTAL SCORE
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono">
                {totalScore}
              </span>
              <span className="text-[10px] text-slate-900/80 font-bold block">/ 990</span>
            </div>
          </div>

          {/* CEFR Level & Evaluation */}
          <div className="p-3 rounded-2xl bg-white/80 border border-amber-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                TRÌNH ĐỘ QUY ĐỔI CEFR:
              </span>
              <strong className="text-slate-900 font-black">
                {cefrLevel}
              </strong>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                MỤC TIÊU BẠN ĐẶT RA:
              </span>
              <strong className="text-amber-800 font-black font-mono">
                {totalScore >= targetScore ? `✓ Đạt mục tiêu (${targetScore}+)` : `Cần +${targetScore - totalScore} điểm (${targetScore}+)`}
              </strong>
            </div>
          </div>

          {/* Official Verification Seal & QR Stamp */}
          <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified TOEIC Assessment by DailyVocab Engine</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-slate-400">
              <QrCode className="w-3.5 h-3.5 text-slate-600" />
              <span>{certNumber}</span>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons (Hidden when printing) */}
        <div className="flex items-center justify-end gap-2 pt-1 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#801732] to-rose-600 hover:from-[#6b132a] hover:to-rose-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải / In Phiếu Báo Điểm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
