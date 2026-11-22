import React, { useState, useEffect, useMemo } from 'react';
import { Word } from '../types';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Volume2 } from 'lucide-react';
import { playSound, speakWord } from '../utils/audio';

interface QuizModeProps {
  words: Word[];
  allWords: Word[];
  onCompleteQuiz: (score: number, total: number) => void;
}

interface Question {
  id: string;
  targetWord: Word;
  prompt: string;
  subPrompt?: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  words,
  allWords,
  onCompleteQuiz,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Generate quiz questions
  useEffect(() => {
    if (!words || words.length === 0) return;

    const generated: Question[] = words.map((target, idx) => {
      // Pick 3 distractors from allWords that are not target
      const pool = allWords.filter(w => w.id !== target.id);
      const shuffledPool = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);

      const isEnglishToVietnamese = idx % 2 === 0;

      let prompt: string;
      let subPrompt: string | undefined;
      let options: { text: string; isCorrect: boolean }[];

      if (isEnglishToVietnamese) {
        prompt = `Nghĩa tiếng Việt của từ "${target.word}" là gì?`;
        subPrompt = `${target.phonetic} • ${target.partOfSpeech}`;
        const rawOptions = [
          { text: target.meaningVi, isCorrect: true },
          ...shuffledPool.map(w => ({ text: w.meaningVi, isCorrect: false })),
        ];
        options = rawOptions.sort(() => 0.5 - Math.random());
      } else {
        prompt = `Từ nào có nghĩa: "${target.meaningVi}"?`;
        subPrompt = `Ngữ cảnh: ${target.definitionEn}`;
        const rawOptions = [
          { text: target.word, isCorrect: true },
          ...shuffledPool.map(w => ({ text: w.word, isCorrect: false })),
        ];
        options = rawOptions.sort(() => 0.5 - Math.random());
      }

      return {
        id: `q-${target.id}-${idx}`,
        targetWord: target,
        prompt,
        subPrompt,
        options,
        explanation: `${target.word} (${target.phonetic}): ${target.meaningVi}. Ví dụ: ${target.example}`,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setCombo(0);
    setIsFinished(false);
  }, [words, allWords]);

  const currentQ = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (selectedOption !== null || !currentQ) return;

    setSelectedOption(optionIndex);
    const chosen = currentQ.options[optionIndex];

    if (chosen.isCorrect) {
      playSound('correct');
      setScore(prev => prev + 1);
      setCombo(prev => prev + 1);
    } else {
      playSound('wrong');
      setCombo(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      playSound('click');
    } else {
      setIsFinished(true);
      playSound('complete');
      onCompleteQuiz(score, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setCombo(0);
    setIsFinished(false);
  };

  if (!words || words.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">Chưa có đủ từ vựng để tạo bài trắc nghiệm.</p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-md mx-auto py-8 text-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          Kết quả Trắc Nghiệm!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Bạn đã hoàn thành xuất sắc bài kiểm tra từ vựng hôm nay.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-6">
          <div className="text-4xl font-black text-brand-600 dark:text-brand-400 mb-1">
            {score} / {questions.length}
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Tỉ lệ chính xác: {percentage}%
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all shadow-md shadow-brand-500/20 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Làm lại bài kiểm tra</span>
        </button>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Quiz Progress & Combo Bar */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Câu hỏi {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-3">
          {combo > 1 && (
            <span className="text-xs font-bold text-amber-500 animate-pulse-subtle">
              🔥 {combo} Combo liên tiếp!
            </span>
          )}
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            Điểm: {score}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/30 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.prompt}
            </h3>
            {currentQ.subPrompt && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {currentQ.subPrompt}
              </p>
            )}
          </div>
          <button
            onClick={() => speakWord(currentQ.targetWord.word)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-600 dark:text-brand-400 flex-shrink-0"
            title="Phát âm từ"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Options */}
        <div className="space-y-3 mt-6">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';

            if (selectedOption !== null) {
              if (option.isCorrect) {
                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/30';
              } else if (isSelected && !option.isCorrect) {
                btnStyle = 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-400 dark:border-rose-600 ring-2 ring-rose-500/30';
              } else {
                btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-2xl border font-medium text-xs sm:text-sm flex items-center justify-between transition-all duration-150 ${btnStyle}`}
              >
                <span>{option.text}</span>
                {selectedOption !== null && (
                  <span>
                    {option.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next Button after answering */}
        {selectedOption !== null && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 mb-4">
              <strong>Giải thích:</strong> {currentQ.explanation}
            </div>

            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all"
            >
              <span>{currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
