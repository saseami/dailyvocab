import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { Volume2, HelpCircle, Check, X, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';
import { speakWord, playSound } from '../utils/audio';

interface SpellingModeProps {
  words: Word[];
  onComplete: () => void;
}

export const SpellingMode: React.FC<SpellingModeProps> = ({ words, onComplete }) => {
  const activeDay = words[0]?.day || 1;
  const storageKey = `dailyvocab_spelling_day_${activeDay}_idx`;

  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < words.length) {
          return parsed;
        }
      }
    } catch {}
    return 0;
  });

  const [inputVal, setInputVal] = useState('');
  const [revealedChars, setRevealedChars] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const safeIndex = words.length > 0 && currentIndex >= 0 && currentIndex < words.length ? currentIndex : 0;
  const currentWord = words[safeIndex];

  // Sync index to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, safeIndex.toString());
    } catch {}
  }, [safeIndex, storageKey]);

  // When words changes (e.g. user selects another day or session)
  useEffect(() => {
    try {
      const dayKey = `dailyvocab_spelling_day_${words[0]?.day || 1}_idx`;
      const saved = localStorage.getItem(dayKey);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < words.length) {
          setCurrentIndex(parsed);
          return;
        }
      }
    } catch {}
    setCurrentIndex(0);
  }, [words]);

  useEffect(() => {
    if (currentWord) {
      speakWord(currentWord.word);
      setInputVal('');
      setRevealedChars(0);
      setStatus('idle');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [currentIndex, currentWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || status !== 'idle') return;

    const normalizedInput = inputVal.trim().toLowerCase();
    const normalizedTarget = currentWord.word.trim().toLowerCase();

    if (normalizedInput === normalizedTarget) {
      setStatus('correct');
      playSound('correct');
    } else {
      setStatus('wrong');
      playSound('wrong');
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound('click');
    } else {
      playSound('complete');
      onComplete();
    }
  };

  const handleRetryCurrentWord = () => {
    setInputVal('');
    setStatus('idle');
    playSound('click');
    if (currentWord) {
      speakWord(currentWord.word);
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleResetEntireSession = () => {
    setCurrentIndex(0);
    setInputVal('');
    setRevealedChars(0);
    setStatus('idle');
    playSound('click');
  };

  const handleRevealHint = () => {
    if (!currentWord) return;
    setRevealedChars(prev => Math.min(prev + 1, currentWord.word.length));
    playSound('click');
  };

  if (!words || words.length === 0 || !currentWord) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500">Chưa có từ vựng cho bài luyện chính tả.</p>
      </div>
    );
  }

  const hintString = currentWord.word
    .split('')
    .map((char, i) => (i < revealedChars || char === ' ' ? char : '_'))
    .join(' ');

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Luyện nghe & Viết: {safeIndex + 1} / {words.length}
          </span>
          <button
            onClick={handleResetEntireSession}
            disabled={currentIndex === 0 && inputVal === '' && revealedChars === 0}
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
              currentIndex === 0 && inputVal === '' && revealedChars === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-transparent'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border-slate-200 dark:border-slate-700'
            }`}
            title="Làm lại toàn bộ bài luyện này từ từ đầu tiên"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>

        <button
          onClick={handleRevealHint}
          className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <Lightbulb className="w-3.5 h-3.5" /> Gợi ý chữ cái
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
        {/* Speaker Button */}
        <div className="mb-6">
          <button
            onClick={() => speakWord(currentWord.word)}
            className="w-20 h-20 rounded-full bg-brand-50 hover:bg-brand-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 inline-flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Bấm để nghe phát âm"
          >
            <Volume2 className="w-10 h-10" />
          </button>
          <p className="text-xs text-slate-400 mt-2">Bấm để nghe phát âm từ</p>
        </div>

        {/* Word Clue & Meaning */}
        <div className="mb-6">
          <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            {currentWord.meaningVi}
          </p>
          <p className="text-xs text-slate-500 italic">
            "{currentWord.definitionEn}"
          </p>
        </div>

        {/* Revealed Hint */}
        <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-brand-600 dark:text-brand-400 mb-6 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          {hintString}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={status !== 'idle'}
            placeholder="Gõ từ tiếng Anh bạn nghe được..."
            className="w-full text-center px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {status === 'idle' ? (
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-sm active:scale-95"
            >
              Kiểm tra (Enter)
            </button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div
                className={`p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
                  status === 'correct'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {status === 'correct' ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Chính xác tuyệt vời! Đáp án: {currentWord.word}</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-rose-600" />
                    <span>Chưa đúng! Đáp án chính xác là: <strong>{currentWord.word}</strong></span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {status === 'wrong' && (
                  <button
                    type="button"
                    onClick={handleRetryCurrentWord}
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Thử lại thẻ này</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className={`${
                    status === 'wrong' ? 'flex-1' : 'w-full'
                  } py-3 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95`}
                >
                  <span>{currentIndex === words.length - 1 ? 'Hoàn thành' : 'Từ tiếp theo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
