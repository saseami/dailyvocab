import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { 
  CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb, 
  HelpCircle, AlertTriangle, ShieldAlert, Award, Sparkles, VolumeX, Eye
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface VocabMasteryTesterProps {
  words: Word[];
  mode: 'easy' | 'hard'; // 'easy': Gợi ý 3 ký tự, 'hard': 0 gợi ý, tối đa 2 lần gợi ý, sai 3 lần là chưa thuộc
  onWordFailed: (word: Word) => void;
  onWordPassed: (word: Word) => void;
  onComplete: () => void;
}

export const VocabMasteryTester: React.FC<VocabMasteryTesterProps> = ({
  words,
  mode,
  onWordFailed,
  onWordPassed,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'failed'>('idle');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [revealedChars, setRevealedChars] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const safeIndex = words.length > 0 && currentIndex >= 0 && currentIndex < words.length ? currentIndex : 0;
  const currentWord = words[safeIndex];

  // Initialize or reset word state
  useEffect(() => {
    if (!currentWord) return;

    setInputVal('');
    setStatus('idle');
    setWrongAttempts(0);
    setHintCount(0);

    if (mode === 'easy') {
      // Mức dễ: Gợi ý trước 3 ký tự đầu
      setRevealedChars(Math.min(3, Math.max(1, currentWord.word.length - 1)));
    } else {
      // Mức khó: 0 có từ nào gợi ý
      setRevealedChars(0);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
  }, [currentIndex, currentWord, mode]);

  if (!words || words.length === 0 || !currentWord) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 font-semibold">
          Không có từ vựng nào trong danh sách kiểm tra này.
        </p>
      </div>
    );
  }

  // Handle Hint Request
  const handleRequestHint = () => {
    if (mode === 'easy') {
      // Mức dễ: Mở thêm 1 ký tự
      setRevealedChars(prev => Math.min(currentWord.word.length, prev + 1));
      playSound('click');
    } else if (mode === 'hard') {
      // Mức khó: Chỉ cho phép gợi ý tối đa 2 lần
      if (hintCount < 2) {
        setHintCount(prev => prev + 1);
        setRevealedChars(prev => Math.min(currentWord.word.length, prev + 1));
        playSound('click');
      }
    }
  };

  // Handle Submit Check
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || status === 'correct' || status === 'failed') return;

    const normalizedInput = inputVal.trim().toLowerCase();
    const normalizedTarget = currentWord.word.trim().toLowerCase();

    if (normalizedInput === normalizedTarget) {
      setStatus('correct');
      playSound('correct');
      onWordPassed(currentWord);
    } else {
      const nextWrongCount = wrongAttempts + 1;
      setWrongAttempts(nextWrongCount);
      playSound('wrong');

      if (mode === 'easy') {
        // Mức dễ: Khi sai 1 lần thì tự động thêm 1 ký tự gợi ý
        setStatus('wrong');
        setRevealedChars(prev => Math.min(currentWord.word.length, prev + 1));
      } else {
        // Mức khó: Sai tới lần thứ 3 thì đánh giá là CHƯA THUỘC TỪ
        if (nextWrongCount >= 3) {
          setStatus('failed');
          onWordFailed(currentWord);
        } else {
          setStatus('wrong');
        }
      }
    }
  };

  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound('click');
    } else {
      playSound('complete');
      onComplete();
    }
  };

  const handleRetryCurrent = () => {
    setInputVal('');
    setStatus('idle');
    playSound('click');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Build the masked hint string
  const hintString = currentWord.word
    .split('')
    .map((char, idx) => {
      if (char === ' ' || char === '-' || char === "'") return char;
      return idx < revealedChars ? char : '_';
    })
    .join(' ');

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Top Header & Mode Indicators */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Từ {safeIndex + 1} / {words.length}
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            mode === 'easy'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
          }`}>
            {mode === 'easy' ? 'Kiểm Tra Mức Dễ (Gợi ý 3 chữ)' : 'Kiểm Tra Mức Khó (0 gợi ý sẵn)'}
          </span>
        </div>

        {/* Nút Gợi ý tuân thủ đúng quy tắc */}
        {mode === 'easy' ? (
          <button
            type="button"
            onClick={handleRequestHint}
            className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Gợi ý thêm chữ cái</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRequestHint}
            disabled={hintCount >= 2}
            className={`flex items-center gap-1 text-xs font-bold transition-all ${
              hintCount >= 2
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-rose-600 dark:text-rose-400 hover:underline'
            }`}
            title="Mức khó: Chỉ được gợi ý tối đa 2 lần"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Gợi ý ({hintCount}/2 lần)</span>
          </button>
        )}
      </div>

      {/* Main Testing Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        
        {/* Anti-Audio Prompt Badge (Đúng yêu cầu: Không đọc lên từ để gợi ý) */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
          <VolumeX className="w-4 h-4 text-[#801732]" />
          <span>Chế độ kiểm tra trí nhớ: Tắt âm thanh để bạn tự hồi tưởng từ</span>
        </div>

        {/* Clue: Vietnamese Meaning & Context */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Nghĩa tiếng Việt cần điền từ tiếng Anh tương ứng:
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {currentWord.meaningVi}
          </h3>
          <p className="text-xs text-slate-500 italic max-w-md mx-auto">
            "{currentWord.definitionEn}"
          </p>
        </div>

        {/* Masked Word Visual */}
        <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-[#801732] dark:text-[#f87171] py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          {hintString}
        </div>

        {/* Input & Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={status === 'correct' || status === 'failed'}
            placeholder="Gõ từ tiếng Anh bạn nhớ..."
            className="w-full text-center px-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-lg focus:outline-none focus:ring-2 focus:ring-[#801732]"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {status === 'idle' && (
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#801732] hover:bg-[#6b132a] disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-md active:scale-95"
            >
              Kiểm Tra (Enter)
            </button>
          )}

          {/* Feedback States */}
          {status === 'correct' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-extrabold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Chính xác tuyệt đối! Đáp án: {currentWord.word}</span>
              </div>
              <button
                type="button"
                onClick={handleNextWord}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>{currentIndex === words.length - 1 ? 'Hoàn thành bài kiểm tra' : 'Từ tiếp theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {status === 'wrong' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 font-bold text-sm flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-amber-600" />
                  <span>Chưa chính xác! (Đã thử {wrongAttempts}{mode === 'hard' ? '/3 lần' : ''})</span>
                </div>
                {mode === 'easy' && (
                  <span className="text-xs text-amber-700">Đã mở thêm 1 chữ cái gợi ý cho bạn!</span>
                )}
                {mode === 'hard' && wrongAttempts < 3 && (
                  <span className="text-xs text-rose-600 font-semibold">
                    Chú ý: Nhập sai tới lần thứ 3 sẽ bị đánh giá là chưa thuộc từ!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetryCurrent}
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Thử lại</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextWord}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-left space-y-1.5">
                <div className="flex items-center gap-2 font-black text-rose-700 dark:text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                  <span>ĐÁNH GIÁ: CHƯA THUỘC TỪ NÀY!</span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300">
                  Bạn đã nhập sai 3 lần. Đáp án chính xác là:{' '}
                  <strong className="text-sm font-black underline">{currentWord.word}</strong> ({currentWord.phonetic}).
                </p>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 italic">
                  ➔ Từ này đã được tự động thêm vào <strong>Phiên 4: Học lại</strong> để bạn ôn luyện kỹ càng hơn!
                </p>
              </div>
              <button
                type="button"
                onClick={handleNextWord}
                className="w-full py-3.5 rounded-2xl bg-[#801732] hover:bg-[#6b132a] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Chuyển sang từ tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
