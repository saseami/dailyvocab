import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { getSpeakingTaskForDay, SpeakingExample, SpeakingTask } from '../data/speakingWritingTasks';
import { Mic, MicOff, Volume2, Award, CheckCircle2, AlertCircle, RotateCcw, Sparkles, BookOpen, ChevronRight, ChevronLeft, Lightbulb, HelpCircle, Eye, EyeOff, Link2, ArrowLeft, Square } from 'lucide-react';
import { VoiceRecognitionService, calculatePronunciationScore, isSpeechRecognitionSupported, cleanWord, PronunciationEvaluation } from '../utils/speechRecognition';
import { speakWord, playSound } from '../utils/audio';
import { getContextualWordInfo, ContextualWordInfo } from '../utils/contextualDictionary';

export interface CustomSentenceToSpeak {
  text: string;
  translationVi?: string;
  source?: 'writing_polished' | 'writing_corrected';
}

interface SpeakingLabProps {
  day: number;
  dayWords: Word[];
  onCompleteTask: (score: number) => void;
  customSentenceToSpeak?: CustomSentenceToSpeak | null;
  onClearCustomSentence?: () => void;
}

export const SpeakingLab: React.FC<SpeakingLabProps> = ({
  day,
  dayWords,
  onCompleteTask,
  customSentenceToSpeak,
  onClearCustomSentence
}) => {
  const [mode, setMode] = useState<'custom' | 'task' | 'words'>(
    customSentenceToSpeak ? 'custom' : 'task'
  );
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [inspectedWord, setInspectedWord] = useState<ContextualWordInfo | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Whenever a new custom sentence arrives, automatically switch to custom mode
  useEffect(() => {
    if (customSentenceToSpeak) {
      setMode('custom');
      setTranscript('');
      setEvaluation(null);
    }
  }, [customSentenceToSpeak]);

  // Get rich speaking task with multiple examples
  const task: SpeakingTask = getSpeakingTaskForDay(day, dayWords);
  const currentExample: SpeakingExample = task.examples[selectedExampleIndex] || task.examples[0];
  const currentWord = dayWords[selectedWordIndex] || dayWords[0];

  const targetText =
    mode === 'custom' && customSentenceToSpeak
      ? customSentenceToSpeak.text
      : mode === 'words'
      ? (currentWord ? currentWord.word : '')
      : currentExample.sentence;

  const targetTextRef = useRef<string>(targetText);
  targetTextRef.current = targetText;

  const voiceServiceRef = useRef<VoiceRecognitionService | null>(null);

  useEffect(() => {
    voiceServiceRef.current = new VoiceRecognitionService(
      (result) => {
        setTranscript(result.transcript);
        if (result.transcript.length > 0) {
          // Live evaluation during recording (unread words are marked 'pending', never buzzing 'wrong' while speaking!)
          const evalResult = calculatePronunciationScore(targetTextRef.current, result.transcript, true);
          setEvaluation(evalResult);

          // If the learner has successfully pronounced >= 75% of the target sentence:
          if (evalResult.score >= 75) {
            playSound('correct');
            onCompleteTask(evalResult.score);
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
  }, [onCompleteTask]);

  const startRecording = () => {
    setErrorMessage('');
    setTranscript('');
    setEvaluation(null);
    voiceServiceRef.current?.reset();
    const started = voiceServiceRef.current?.start();
    if (started) {
      setIsRecording(true);
      playSound('click');
    }
  };

  const stopRecording = () => {
    try {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stop();
      }
    } catch (e) {
      console.warn('Error stopping voice service in SpeakingLab:', e);
    } finally {
      setIsRecording(false);
    }
    playSound('click');

    // Finalize evaluation with isLive = false (marks remaining words as incorrect)
    if (transcript.trim()) {
      const finalEval = calculatePronunciationScore(targetTextRef.current, transcript, false);
      setEvaluation(finalEval);
      if (finalEval.score >= 75) {
        playSound('correct');
        onCompleteTask(finalEval.score);
      } else {
        playSound('wrong');
      }
    }
  };

  const handleSimulateSpeaking = () => {
    try {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stop();
      }
    } catch {}
    setIsRecording(false);

    const targetSentence = targetTextRef.current;
    setTranscript(targetSentence);
    const finalEval = calculatePronunciationScore(targetSentence, targetSentence, false);
    setEvaluation(finalEval);
    playSound('correct');
    onCompleteTask(95);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleRestartRecording = () => {
    setErrorMessage('');
    setTranscript('');
    setEvaluation(null);
    voiceServiceRef.current?.reset();
    if (!isRecording) {
      const started = voiceServiceRef.current?.start();
      if (started) {
        setIsRecording(true);
        playSound('click');
      }
    }
  };

  const handlePlaySample = (speed: number) => {
    setPlaybackSpeed(speed);
    speakWord(targetText, speed);
  };

  const handleSelectWord = (idx: number) => {
    setSelectedWordIndex(idx);
    setTranscript('');
    setEvaluation(null);
    setInspectedWord(null);
    if (isRecording) {
      voiceServiceRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleSelectExample = (idx: number) => {
    setSelectedExampleIndex(idx);
    setTranscript('');
    setEvaluation(null);
    setInspectedWord(null);
    if (isRecording) {
      voiceServiceRef.current?.stop();
      setIsRecording(false);
    }
  };

  // Split sentence into words for display
  const sentenceWords = targetText.split(/\s+/).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto py-3 space-y-5">
      {/* Speaking Mode Selector & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-[#801732] dark:text-rose-400" />
            <span>Phần 2: Luyện Nói &amp; Phát Âm AI (Speaking Lab)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Luyện phát âm câu vừa viết hoặc các đoạn đàm thoại chuẩn TOEIC Speaking (Hỗ trợ ngắt nghỉ tự nhiên)
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto flex-wrap">
          {customSentenceToSpeak && (
            <button
              onClick={() => { setMode('custom'); setTranscript(''); setEvaluation(null); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'custom'
                  ? 'bg-[#801732] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Câu bạn vừa viết</span>
            </button>
          )}

          <button
            onClick={() => { setMode('task'); setTranscript(''); setEvaluation(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'task'
                ? 'bg-[#801732] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Đoạn đối thoại ({task.examples.length} ví dụ)
          </button>

          <button
            onClick={() => { setMode('words'); setTranscript(''); setEvaluation(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'words'
                ? 'bg-[#801732] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Từng từ đơn ({dayWords.length})
          </button>
        </div>
      </div>

      {/* Multi-Example Selector Tabs for Current Day */}
      {mode === 'task' && task.examples.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {task.examples.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => handleSelectExample(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedExampleIndex === idx
                  ? 'bg-[#801732] text-white shadow-sm scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{ex.title.split(':')[0] || `Ví dụ ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      )}

      {/* Words Carousel Selector */}
      {mode === 'words' && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {dayWords.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => handleSelectWord(idx)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedWordIndex === idx
                  ? 'bg-[#801732] text-white shadow-sm scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{w.word}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Practice Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-md">
        
        {/* Scenario Header: Custom Mode (From Writing) */}
        {mode === 'custom' && customSentenceToSpeak && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50/50 dark:from-rose-950/30 dark:to-amber-950/20 border border-rose-200/80 dark:border-rose-900/40 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#801732] dark:text-rose-400">
                  🎯 BÀI LUYỆN NÓI TỪ CÂU BẠN VỪA VIẾT
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-[#801732] text-white">
                  {customSentenceToSpeak.source === 'writing_polished' ? '⭐ Câu Nâng Cấp Bản Xứ (Band C1)' : '📝 Câu Của Bạn (Đã Sửa Lỗi)'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                Đọc to câu này vào microphone để AI chấm điểm phát âm. Bạn có thể <strong>ngắt nghỉ lấy hơi thoải mái</strong>, hệ thống sẽ tự động ghép trọn vẹn câu!
              </p>
            </div>

            {onClearCustomSentence && (
              <button
                onClick={onClearCustomSentence}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Đổi câu khác ✕
              </button>
            )}
          </div>
        )}

        {/* Scenario Header: Task Mode */}
        {mode === 'task' && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#801732] dark:text-rose-400 block mb-1">
                {currentExample.title}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                👉 {currentExample.scenario}
              </p>
            </div>
            
            <button
              onClick={() => setShowExplanation(prev => !prev)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:text-[#801732] transition-colors flex-shrink-0"
              title="Bật/Tắt giải thích cấu trúc"
            >
              {showExplanation ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-[#801732]" />}
              <span>{showExplanation ? 'Ẩn phân tích' : 'Xem cấu trúc & dịch nghĩa'}</span>
            </button>
          </div>
        )}

        {/* Playback Controls (0.5x, 0.75x, 1x) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Tốc độ đọc mẫu:</span>
            <div className="inline-flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {[
                { speed: 0.5, label: '0.5x (Chậm)' },
                { speed: 0.75, label: '0.75x' },
                { speed: 1.0, label: '1.0x (Chuẩn)' }
              ].map(({ speed, label }) => (
                <button
                  key={speed}
                  onClick={() => handlePlaySample(speed)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    playbackSpeed === speed
                      ? 'bg-[#801732] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handlePlaySample(playbackSpeed)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all"
          >
            <Volume2 className="w-4 h-4 text-[#801732] dark:text-rose-400" />
            <span>Nghe AI Đọc Mẫu Câu Này</span>
          </button>
        </div>

        {/* Target Sentence Display with Live Word Highlighting */}
        <div className="my-6 text-center">
          <div className="flex items-center justify-between mb-3 px-2 flex-wrap gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Câu cần phát âm (Từ đã đọc đúng sẽ tự động sáng xanh ✓):
            </span>
            <span className="text-[11px] text-[#801732] dark:text-rose-400 font-bold">
              💡 Bấm vào từ bất kỳ để nghe đọc mẫu &amp; xem giải nghĩa
            </span>
          </div>

          {/* Interactive Words Sentence */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 max-w-3xl mx-auto">
            {sentenceWords.map((wordStr, wIdx) => {
              const cleanW = cleanWord(wordStr);
              const isCorrect = evaluation?.wordFeedback.some(
                (fb) => cleanWord(fb.word) === cleanW && fb.status === 'correct'
              );

              return (
                <button
                  key={wIdx}
                  type="button"
                  onClick={() => {
                    const info = getContextualWordInfo(wordStr, targetText);
                    setInspectedWord(info);
                    speakWord(cleanW, 0.9);
                  }}
                  className={`text-base sm:text-xl font-extrabold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    isCorrect
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-xs scale-102 font-black'
                      : 'text-slate-900 dark:text-white hover:text-[#801732] dark:hover:text-rose-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                  title="Bấm để nghe phát âm, xem nghĩa & cụm từ trong câu"
                >
                  {isCorrect ? `✓ ${wordStr}` : wordStr}
                </button>
              );
            })}
          </div>

          {/* Word & Collocation Inspection Popover if word clicked */}
          {inspectedWord && (
            <div className="mt-3 p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/80 text-xs text-slate-900 dark:text-rose-100 shadow-lg animate-fade-in flex flex-col gap-2 max-w-lg mx-auto text-left">
              <div className="flex items-center justify-between pb-1.5 border-b border-rose-200/60 dark:border-rose-800/60">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-[#801732] dark:text-rose-300">
                    {inspectedWord.word}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {inspectedWord.ipa}
                  </span>
                  {inspectedWord.partOfSpeech && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-rose-200/60 dark:bg-rose-900/60 text-[#801732] dark:text-rose-200">
                      {inspectedWord.partOfSpeech}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakWord(inspectedWord.word, 0.9)}
                    className="p-1 rounded-lg hover:bg-rose-200/60 dark:hover:bg-rose-800/60 text-[#801732] dark:text-rose-300 transition-colors"
                    title="Nghe phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectedWord(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-1"
                    title="Đóng"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p className="font-semibold text-slate-800 dark:text-slate-200">
                👉 <strong>Nghĩa từ:</strong> {inspectedWord.meaningVi}
              </p>

              {/* Show Collocation if present */}
              {inspectedWord.collocation && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-800/60 mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#801732] dark:text-rose-400 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#801732]" />
                      <span>Cụm từ đi đôi trong câu: <u>{inspectedWord.collocation.phrase}</u></span>
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(inspectedWord.collocation!.phrase, 0.9)}
                      className="p-1 rounded text-[#801732] hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      title="Nghe phát âm cả cụm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Dịch nghĩa cụm: <strong>{inspectedWord.collocation.meaningVi}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Translation Box */}
        {mode === 'custom' && customSentenceToSpeak?.translationVi && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 text-left">
            <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider block mb-1">
              🇻🇳 Dịch nghĩa câu hoàn chỉnh:
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
              "{customSentenceToSpeak.translationVi}"
            </p>
          </div>
        )}

        {mode === 'task' && showExplanation && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 text-left animate-fade-in">
            {/* Vietnamese Translation */}
            <div className="mb-3 pb-3 border-b border-amber-200/60 dark:border-amber-900/40">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block mb-1">
                🇻🇳 Dịch nghĩa câu hoàn chỉnh:
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                "{currentExample.translationVi}"
              </p>
            </div>

            {/* Grammar Points Breakdown */}
            <div>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block mb-2">
                📐 Giải thích cấu trúc ngữ pháp &amp; Điểm thi TOEIC:
              </span>
              <div className="space-y-2.5">
                {currentExample.grammarPoints.map((gp, gIdx) => (
                  <div key={gIdx} className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/50 dark:border-amber-900/30 text-xs">
                    <div className="font-mono font-bold text-[#801732] dark:text-rose-400 mb-0.5">
                      {gp.pattern}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                      {gp.explanation}
                    </p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300/90 font-semibold">
                      💡 <strong>Mẹo TOEIC:</strong> {gp.toeicTip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Recording Notice & Controls */}
        {isRecording && (
          <div className="my-4 p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3 flex-wrap animate-fade-in">
            <div className="flex items-center gap-2.5 text-xs font-bold text-rose-800 dark:text-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
              <span>Đang lắng nghe... Bạn có thể <strong>ngắt nghỉ lấy hơi thoải mái</strong>, hệ thống không bao giờ tự ý reset!</span>
            </div>
            
            <button
              type="button"
              onClick={handleRestartRecording}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đọc lại từ đầu</span>
            </button>
          </div>
        )}

        {/* Microphone Recording Action Button & Controls */}
        <div className="my-6 flex flex-col items-center">
          <div className="flex items-center gap-4">
            {/* Main Round Mic Button */}
            <button
              onClick={toggleRecording}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-[#801732] to-[#a32847] hover:from-[#6b132a] hover:to-[#8c223c] text-white shadow-[#801732]/30 hover:scale-105'
              }`}
              title={isRecording ? 'Bấm để hoàn thành đọc' : 'Bấm để bắt đầu đọc'}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              {isRecording && (
                <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-50 pointer-events-none" />
              )}
            </button>

            {/* Stop and Finish Button when recording */}
            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Dừng &amp; Chấm Điểm</span>
              </button>
            )}
          </div>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-3 text-center">
            {isRecording
              ? 'Đang lắng nghe... Đọc xong hãy bấm "Dừng & Chấm Điểm" hoặc bấm lại vào Micro!'
              : 'Bấm vào micro để bắt đầu đọc phát âm'}
          </p>

          {/* Fast Simulation / Safari Fallback */}
          {!isRecording && (
            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSimulateSpeaking}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[#801732] dark:text-rose-300 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                title="Dành cho người học ở nơi công cộng hoặc Safari không tiện mở mic"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Đọc &amp; Chấm Mẫu Nhanh (Không cần mic)</span>
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-xs text-rose-500 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateSpeaking}
                className="text-xs text-[#801732] dark:text-rose-300 font-bold underline"
              >
                👉 Bấm vào đây để AI dùng câu mẫu chấm điểm và đi tiếp
              </button>
            </div>
          )}
        </div>

        {/* Speech Evaluation Results */}
        {transcript && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left animate-fade-in space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lời thoại AI thu được qua Micro:
              </span>
              {evaluation && (
                <span className={`text-xs font-black px-3.5 py-1 rounded-full ${
                  evaluation.score >= 75 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                }`}>
                  Độ chuẩn xác phát âm: {evaluation.score}% ({evaluation.matchedCount}/{evaluation.totalWords} từ)
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 italic p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
              "{transcript}"
            </p>

            {/* Word-by-Word Analysis */}
            {evaluation && evaluation.wordFeedback.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Chi tiết từng từ trong câu:
                  </span>
                  <span className="text-[11px] text-[#801732] dark:text-rose-400 font-semibold">
                    💡 Bấm vào từ để nghe phát âm mẫu chuẩn
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.wordFeedback.map((item, idx) => {
                    const cleanW = cleanWord(item.word);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => speakWord(cleanW, 0.9)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                          item.status === 'correct'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            : item.status === 'pending'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100'
                        }`}
                        title={`Bấm để nghe phát âm từ "${cleanW}"`}
                      >
                        <Volume2 className="w-3 h-3 opacity-70" />
                        <span>
                          {item.status === 'correct' ? '✓' : item.status === 'pending' ? '⏳' : '⚠️'}
                        </span>
                        <span>{item.word}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Intonation & Speech Tips */}
        {currentExample.speechTip && mode === 'task' && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-left text-xs text-slate-500 dark:text-slate-400">
            <strong>Mẹo Speaking đạt điểm cao:</strong> {currentExample.speechTip}
          </div>
        )}

      </div>
    </div>
  );
};
