import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Word } from '../types';
import { Volume2, Star, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Lightbulb, Sparkles, Mic, MicOff, AlertCircle, Award } from 'lucide-react';
import { speakWord, playSound } from '../utils/audio';
import { VoiceRecognitionService, calculatePronunciationScore, PronunciationEvaluation } from '../utils/speechRecognition';

interface FlashcardModeProps {
  words: Word[];
  bookmarkedWords: string[];
  learnedWords: string[];
  masteredWords: string[];
  onToggleBookmark: (wordId: string) => void;
  onReviewWord: (wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onCompleteDay: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  words,
  bookmarkedWords,
  learnedWords,
  masteredWords,
  onToggleBookmark,
  onReviewWord,
  onCompleteDay,
}) => {
  const activeDay = words[0]?.day || 1;
  const storageKey = `dailyvocab_flashcard_day_${activeDay}_idx`;

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

  const [isFlipped, setIsFlipped] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Sync index to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, currentIndex.toString());
    } catch {}
  }, [currentIndex, storageKey]);

  // When words changes (e.g. user selects another day or session)
  useEffect(() => {
    try {
      const dayKey = `dailyvocab_flashcard_day_${words[0]?.day || 1}_idx`;
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

  // Pronunciation Evaluation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState<'word' | 'example' | null>(null);
  const [transcript, setTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Safety clamp index whenever words change
  const safeIndex = words.length > 0 && currentIndex >= 0 && currentIndex < words.length ? currentIndex : 0;
  const currentWord = words[safeIndex];
  const voiceServiceRef = useRef<VoiceRecognitionService | null>(null);
  const currentTargetTextRef = useRef<string>('');
  const recordingTargetRef = useRef<'word' | 'example' | null>(null);

  // Initialize Speech Recognition once
  useEffect(() => {
    voiceServiceRef.current = new VoiceRecognitionService(
      (result) => {
        setTranscript(result.transcript);
        if (result.isFinal || result.transcript.length > 0) {
          const target = currentTargetTextRef.current || (recordingTargetRef.current === 'example' ? currentWord?.example : currentWord?.word) || '';
          if (target) {
            const evalResult = calculatePronunciationScore(target, result.transcript);
            setEvaluation(evalResult);
            // Only play sound chime when final speech result is detected to avoid annoying continuous interim chimes
            if (result.isFinal) {
              if (evalResult.score >= 80) {
                playSound('correct');
              } else {
                playSound('wrong');
              }
            }
          }
        }
      },
      (err) => {
        setErrorMessage(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    return () => {
      voiceServiceRef.current?.stop();
    };
  }, []); // Run once on mount

  const handleFlip = useCallback(() => {
    if (isRecording) {
      voiceServiceRef.current?.stop();
      setIsRecording(false);
    }
    setIsFlipped(prev => !prev);
    playSound('flip');
  }, [isRecording]);

  const handleNext = useCallback(() => {
    if (isRecording) {
      voiceServiceRef.current?.stop();
      setIsRecording(false);
    }
    setTranscript('');
    setEvaluation(null);
    setRecordingTarget(null);
    recordingTargetRef.current = null;
    currentTargetTextRef.current = '';
    setErrorMessage('');

    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      playSound('click');
    } else {
      onCompleteDay();
    }
  }, [currentIndex, words.length, onCompleteDay, isRecording]);

  const handlePrev = useCallback(() => {
    if (isRecording) {
      voiceServiceRef.current?.stop();
      setIsRecording(false);
    }
    setTranscript('');
    setEvaluation(null);
    setRecordingTarget(null);
    recordingTargetRef.current = null;
    currentTargetTextRef.current = '';
    setErrorMessage('');

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
      playSound('click');
    }
  }, [currentIndex, isRecording]);

  const handleRate = useCallback((rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentWord) return;
    onReviewWord(currentWord.id, rating);
    if (rating === 'again') {
      playSound('wrong');
    } else {
      playSound('correct');
    }
    handleNext();
  }, [currentWord, onReviewWord, handleNext]);

  // Voice recording toggle
  const toggleRecording = (target: 'word' | 'example', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setErrorMessage('');

    if (isRecording && recordingTargetRef.current === target) {
      voiceServiceRef.current?.stop();
      setIsRecording(false);
      setRecordingTarget(null);
      recordingTargetRef.current = null;
      currentTargetTextRef.current = '';
    } else {
      // Set target immediately into the ref BEFORE starting recognition!
      const targetText = target === 'example' ? currentWord.example : currentWord.word;
      currentTargetTextRef.current = targetText;
      recordingTargetRef.current = target;
      setRecordingTarget(target);
      setTranscript('');
      setEvaluation(null);

      const started = voiceServiceRef.current?.start();
      if (started) {
        setIsRecording(true);
        playSound('click');
      }
    }
  };

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key.toLowerCase() === 's' && currentWord) {
        speakWord(isFlipped ? currentWord.example : currentWord.word, playbackSpeed);
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, handleRate, currentWord, isFlipped, playbackSpeed]);

  if (!words || words.length === 0 || !currentWord) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Chưa có từ vựng nào trong mục này. Vui lòng chọn ngày khác hoặc thêm từ mới!
        </p>
      </div>
    );
  }

  const isBookmarked = bookmarkedWords.includes(currentWord.id);
  const isMastered = masteredWords.includes(currentWord.id);

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Top Controls & Counter */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Thẻ {safeIndex + 1} / {words.length}
          </span>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              playSound('click');
            }}
            disabled={currentIndex === 0}
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-transparent'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border-slate-200 dark:border-slate-700'
            }`}
            title="Quay về thẻ đầu tiên"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Về thẻ 1</span>
          </button>
          {isMastered && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Đã thuộc
            </span>
          )}
        </div>

        {/* Speed & Star Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            {[0.25, 0.5, 1.0].map(sp => (
              <button
                key={sp}
                onClick={(e) => { e.stopPropagation(); setPlaybackSpeed(sp); }}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  playbackSpeed === sp
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title={`Tốc độ đọc ${sp}x`}
              >
                {sp}x
              </button>
            ))}
          </div>

          <button
            onClick={() => onToggleBookmark(currentWord.id)}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Đánh dấu từ yêu thích"
          >
            <Star className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div 
        onClick={handleFlip}
        className="relative w-full h-[480px] sm:h-[520px] cursor-pointer select-none perspective-1000"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                {currentWord.partOfSpeech} • CEFR {currentWord.cefr}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentWord.word, playbackSpeed);
                  }}
                  className="p-3 rounded-full bg-brand-50 hover:bg-brand-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 transition-all active:scale-95 shadow-sm"
                  title={`Nghe phát âm (${playbackSpeed}x)`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Word Center */}
            <div className="text-center my-auto py-4">
              {currentWord.toeicContext && (
                <span className="inline-block px-2.5 py-1 mb-3 text-[11px] font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  🎯 {currentWord.toeicContext}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                {currentWord.word}
              </h2>
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-mono mb-4">
                {currentWord.phonetic}
              </p>

              {/* Pronunciation Assessment on Front */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="inline-flex flex-col items-center gap-2"
              >
                <button
                  type="button"
                  onClick={(e) => toggleRecording('word', e)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                    isRecording && recordingTarget === 'word'
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/40'
                      : 'bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100'
                  }`}
                >
                  {isRecording && recordingTarget === 'word' ? (
                    <>
                      <MicOff className="w-4 h-4 text-white" />
                      <span>Đang nghe bạn đọc từ... (Bấm dừng)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-brand-500" />
                      <span>Đọc thử từ này để AI chấm điểm</span>
                    </>
                  )}
                </button>

                {/* Score badge for word */}
                {evaluation && recordingTarget === 'word' && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold animate-fade-in bg-slate-100 dark:bg-slate-800">
                    <span className={evaluation.score >= 80 ? 'text-emerald-500' : 'text-amber-500'}>
                      {evaluation.score >= 80 ? '🎯 Xuất sắc:' : '⚠️ Cần luyện thêm:'} {evaluation.score}%
                    </span>
                    {transcript && <span className="text-slate-400 italic">("{transcript}")</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Flip Hint */}
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Bấm vào thẻ hoặc nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-300">Space</kbd> để xem nghĩa & ví dụ</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 flex flex-col justify-between overflow-y-auto no-scrollbar">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Nghĩa & Ngữ cảnh
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentWord.word, playbackSpeed);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"
                    title={`Nghe phát âm từ (${playbackSpeed}x)`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Vietnamese Meaning */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {currentWord.meaningVi}
              </h3>

              {/* English Definition */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic mb-4 leading-relaxed">
                "{currentWord.definitionEn}"
              </p>

              {/* Example Sentence Box with Audio + Mic Assessment */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                      CÂU VÍ DỤ THỰC TẾ:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {currentWord.example}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentWord.example, playbackSpeed);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-slate-200 transition-colors"
                      title={`Nghe câu ví dụ (${playbackSpeed}x)`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleRecording('example', e)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isRecording && recordingTarget === 'example'
                          ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30'
                          : 'bg-brand-50 hover:bg-brand-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-brand-600 dark:text-brand-300'
                      }`}
                      title="Luyện đọc to NGUYÊN CÂU ví dụ qua Micro"
                    >
                      {isRecording && recordingTarget === 'example' ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Dừng thu</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Đọc nguyên câu</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  👉 {currentWord.exampleVi}
                </p>

                {/* Active listening banner for entire example sentence */}
                {isRecording && recordingTarget === 'example' && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 animate-pulse">
                    <Mic className="w-4 h-4 text-rose-600 flex-shrink-0 animate-bounce" />
                    <span>Đang lắng nghe... Hãy đọc to cả câu: <strong>"{currentWord.example}"</strong></span>
                  </div>
                )}

                {/* Pronunciation Evaluation for Entire Example Sentence */}
                {evaluation && recordingTarget === 'example' && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 animate-fade-in"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        ĐÁNH GIÁ PHÁT ÂM NGUYÊN CÂU:
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        evaluation.score >= 80
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}>
                        Độ chuẩn xác: {evaluation.score}%
                      </span>
                    </div>

                    {transcript && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">
                        AI nhận diện được: <span className="font-medium text-slate-700 dark:text-slate-200">"{transcript}"</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-400">
                        Chi tiết phát âm từng từ:
                      </span>
                      <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                        💡 Bấm vào từ để nghe phát âm mẫu
                      </span>
                    </div>

                    {/* Word-by-word evaluation of all words in the example sentence */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {evaluation.wordFeedback.map((wf, idx) => {
                        const cleanW = wf.word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '');
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(cleanW, 0.9);
                            }}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
                              wf.status === 'correct'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:bg-rose-100'
                            }`}
                            title={`Bấm để nghe phát âm chuẩn từ "${cleanW}"`}
                          >
                            <Volume2 className="w-3 h-3 opacity-70" />
                            <span>{wf.status === 'correct' ? '✓' : '⚠️'}</span>
                            <span>{wf.word}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mnemonic / Memory Tip */}
              {currentWord.mnemonic && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Mẹo nhớ:</strong> {currentWord.mnemonic}</span>
                </div>
              )}
            </div>

            {/* SRS Recommendation based on pronunciation */}
            <div className="text-center pt-2">
              {evaluation && evaluation.score >= 80 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse-subtle">
                  🔥 Phát âm rất chuẩn ({evaluation.score}%)! Đề xuất đánh giá: <strong>Thuộc (3)</strong> hoặc <strong>Rất dễ (4)</strong>
                </span>
              ) : evaluation && evaluation.score < 70 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  ⚠️ Phát âm cần rèn thêm ({evaluation.score}%)! Đề xuất đánh giá: <strong>Chưa thuộc (1)</strong> hoặc <strong>Hơi khó (2)</strong>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Đánh giá mức độ nhớ bên dưới để lên lịch ôn lại (SRS)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SRS Rating Buttons when flipped */}
      {isFlipped ? (
        <div className="grid grid-cols-4 gap-2 mt-4 animate-fade-in">
          <button
            onClick={() => handleRate('again')}
            className="flex flex-col items-center py-2.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-all font-semibold active:scale-95"
            title="Nhấn phím 1"
          >
            <span className="text-xs sm:text-sm font-bold">Chưa thuộc</span>
            <span className="text-[10px] opacity-75">Ôn lại sớm (1)</span>
          </button>
          <button
            onClick={() => handleRate('hard')}
            className="flex flex-col items-center py-2.5 px-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-all font-semibold active:scale-95"
            title="Nhấn phím 2"
          >
            <span className="text-xs sm:text-sm font-bold">Hơi khó</span>
            <span className="text-[10px] opacity-75">1-2 ngày (2)</span>
          </button>
          <button
            onClick={() => handleRate('good')}
            className={`flex flex-col items-center py-2.5 px-2 rounded-xl border transition-all font-semibold active:scale-95 ${
              evaluation && evaluation.score >= 80
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-400 ring-2 ring-blue-500/30'
                : 'bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            }`}
            title="Nhấn phím 3"
          >
            <span className="text-xs sm:text-sm font-bold">Thuộc</span>
            <span className="text-[10px] opacity-75">3-4 ngày (3)</span>
          </button>
          <button
            onClick={() => handleRate('easy')}
            className={`flex flex-col items-center py-2.5 px-2 rounded-xl border transition-all font-semibold active:scale-95 ${
              evaluation && evaluation.score >= 90
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
            title="Nhấn phím 4"
          >
            <span className="text-xs sm:text-sm font-bold">Rất dễ</span>
            <span className="text-[10px] opacity-75">1 tuần (4)</span>
          </button>
        </div>
      ) : (
        /* Prev / Next controls when not flipped */
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Từ trước</span>
          </button>

          <button
            onClick={handleFlip}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all"
          >
            Lật thẻ xem nghĩa (Space)
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <span>{currentIndex === words.length - 1 ? 'Hoàn thành' : 'Từ tiếp'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
