import React from 'react';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface OMRAnswerSheetProps {
  totalQuestions: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onSelectAnswer: (questionIndex: number, answer: 'A' | 'B' | 'C' | 'D') => void;
  isThreeOptionQuestion?: (index: number) => boolean;
}

export const OMRAnswerSheet: React.FC<OMRAnswerSheetProps> = ({
  totalQuestions,
  userAnswers,
  currentQuestionIndex,
  onSelectQuestion,
  onSelectAnswer,
  isThreeOptionQuestion,
}) => {
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
          <FileText className="w-4 h-4 text-[#801732] dark:text-rose-400" />
          <span>Phiếu Tô Tròn ETS (OMR Answer Sheet)</span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 font-mono">
          Đã tô: <strong className="text-[#801732] dark:text-rose-400">{answeredCount}</strong> / {totalQuestions}
        </span>
      </div>

      {/* Grid of Numbered Rows with Bubbles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1 pr-2 scrollbar-thin">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = currentQuestionIndex === idx;
          const currentAnswer = userAnswers[idx];
          const has3Options = isThreeOptionQuestion ? isThreeOptionQuestion(idx) : false;
          const options: ('A' | 'B' | 'C' | 'D')[] = has3Options ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];

          return (
            <div
              key={idx}
              onClick={() => onSelectQuestion(idx)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                isCurrent
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-xs'
                  : currentAnswer
                  ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <span className={`text-[11px] font-black w-6 text-center font-mono ${
                isCurrent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
              }`}>
                {idx + 1}
              </span>

              {/* Bubbles A, B, C, D */}
              <div className="flex items-center gap-1">
                {options.map((opt) => {
                  const isChecked = currentAnswer === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAnswer(idx, opt);
                      }}
                      className={`w-6 h-6 rounded-full text-[10px] font-black transition-all flex items-center justify-center border ${
                        isChecked
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs font-mono ring-1 ring-slate-400'
                          : 'border-slate-300 dark:border-slate-600 text-slate-500 hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
