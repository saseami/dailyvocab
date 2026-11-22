import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, AlertTriangle, CheckCircle2, ShieldAlert, RotateCcw, 
  Trash2, Sword, BookOpen, Headphones, Layers, Award, Sparkles, Volume2 
} from 'lucide-react';
import { getErrorVault, resolveWrongQuestion, clearErrorVault, WrongQuestionItem, getErrorVaultStats } from '../utils/errorVault';
import { playSound, speakWord } from '../utils/audio';
import { unlockAchievement } from '../utils/achievements';
import confetti from 'canvas-confetti';

interface ErrorVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ErrorVaultModal: React.FC<ErrorVaultModalProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<WrongQuestionItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'listening' | 'reading' | 'exam'>('all');
  
  // Revenge Mode State
  const [isRevengeMode, setIsRevengeMode] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [revengeSuccessCount, setRevengeSuccessCount] = useState<number>(0);

  const loadData = () => {
    setItems(getErrorVault());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setIsRevengeMode(false);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [isOpen]);

  const stats = useMemo(() => getErrorVaultStats(), [items]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((q) => q.source === filter);
  }, [items, filter]);

  if (!isOpen) return null;

  const handleStartRevenge = () => {
    if (filteredItems.length === 0) return;
    setIsRevengeMode(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    playSound('click');
  };

  const handleRevengeAnswer = (optKey: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;
    setSelectedOption(optKey);
    setIsAnswered(true);

    const currentQ = filteredItems[currentIndex];
    if (optKey === currentQ.correctAnswer) {
      playSound('correct');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      setRevengeSuccessCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          unlockAchievement('iron_will');
        }
        return next;
      });
      // Remove from vault
      resolveWrongQuestion(currentQ.id);
    } else {
      playSound('wrong');
    }
  };

  const handleNextRevenge = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed all revenge questions
      setIsRevengeMode(false);
      loadData();
      playSound('complete');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn dọn sạch tất cả câu sai trong sổ tay không?')) {
      clearErrorVault();
      setItems([]);
      playSound('click');
    }
  };

  const currentRevengeQ = filteredItems[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-950/50 border border-rose-500/30 text-rose-500 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Sổ Tay Câu Sai &amp; Bẫy ETS (Error Vault)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                  {items.length} câu cần khắc phục
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tự động gom lại các bẫy bạn từng chọn nhầm để luyện tập phục thù
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

        {/* REVENGE PRACTICE MODE */}
        {isRevengeMode && currentRevengeQ ? (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header progress */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
                <span className="text-xs font-black text-rose-900 dark:text-rose-200">
                  CHẾ ĐỘ PHỤC THÙ: Câu {currentIndex + 1} / {filteredItems.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsRevengeMode(false);
                  loadData();
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Thoát phục thù
              </button>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Chủ đề: {currentRevengeQ.topicTitle}</span>
                {currentRevengeQ.trapType && (
                  <span className="text-amber-500 font-extrabold">⚠️ {currentRevengeQ.trapType}</span>
                )}
              </div>

              {currentRevengeQ.audioPrompt && (
                <div className="flex items-center gap-2 pt-1 pb-1">
                  <button
                    onClick={() => speakWord(currentRevengeQ.audioPrompt || '')}
                    className="px-3 py-1.5 rounded-xl bg-[#801732] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe lại audio đề bài</span>
                  </button>
                </div>
              )}

              <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                {currentRevengeQ.questionText}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentRevengeQ.options.map((opt) => {
                const isCorrect = opt.key === currentRevengeQ.correctAnswer;
                const isSelected = selectedOption === opt.key;

                let optClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400';
                if (isAnswered) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    disabled={isAnswered}
                    onClick={() => handleRevengeAnswer(opt.key)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optClass}`}
                  >
                    <span>{opt.text}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 text-xs font-black text-blue-800 dark:text-blue-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Giải Thích &amp; Phá Bẫy ETS:</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentRevengeQ.explanationVi}
                </p>
                {currentRevengeQ.grammarRuleVi && (
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/40 p-2 rounded-xl">
                    📖 {currentRevengeQ.grammarRuleVi}
                  </p>
                )}

                <button
                  onClick={handleNextRevenge}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#801732] to-rose-600 hover:from-[#6b132a] hover:to-rose-700 text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>{currentIndex < filteredItems.length - 1 ? 'Sang câu tiếp theo' : 'Hoàn tất đợt phục thù 🎉'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* VAULT LIST & STATS VIEW */
          <div className="space-y-4">
            {/* Top Analysis Card */}
            {items.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-extrabold text-amber-900 dark:text-amber-200 block">
                      Bẫy bạn hay gặp nhất: "{stats.topTrap}"
                    </span>
                    <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                      Nghe ({stats.bySkill.listening}) • Đọc ({stats.bySkill.reading}) • Thi thử ({stats.bySkill.exam})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleStartRevenge}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-[#801732] hover:from-rose-700 hover:to-[#6b132a] text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Sword className="w-3.5 h-3.5" />
                    <span>Luyện Phục Thù ({filteredItems.length})</span>
                  </button>

                  <button
                    onClick={handleClearAll}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 transition-all"
                    title="Xóa tất cả câu trong sổ tay"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filter === 'all'
                    ? 'bg-[#801732] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Tất cả ({items.length})
              </button>
              <button
                onClick={() => setFilter('listening')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  filter === 'listening'
                    ? 'bg-[#801732] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Luyện Nghe ({stats.bySkill.listening})</span>
              </button>
              <button
                onClick={() => setFilter('reading')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  filter === 'reading'
                    ? 'bg-[#801732] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Luyện Đọc ({stats.bySkill.reading})</span>
              </button>
              <button
                onClick={() => setFilter('exam')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                  filter === 'exam'
                    ? 'bg-[#801732] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Thi Thử ({stats.bySkill.exam})</span>
              </button>
            </div>

            {/* Items List */}
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-black">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  Tuyệt vời! Không có câu sai nào trong mục này.
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Mỗi khi bạn làm bài trắc nghiệm hay luyện nghe và chọn nhầm bẫy, hệ thống sẽ tự động lưu lại đây để bạn luyện phục thù.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Part {q.part} • {q.topicTitle}
                      </span>
                      {q.trapType && (
                        <span className="text-amber-500 font-extrabold">
                          ⚠️ {q.trapType}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.questionText}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 font-medium">
                        Bạn đã chọn: <strong>({q.userAnswer})</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                        Đáp án đúng: <strong>({q.correctAnswer})</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-700 leading-relaxed">
                      💡 <strong>Phá bẫy:</strong> {q.explanationVi}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          resolveWrongQuestion(q.id);
                          loadData();
                          playSound('click');
                        }}
                        className="text-[11px] font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        Đã hiểu &amp; gỡ khỏi sổ tay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
